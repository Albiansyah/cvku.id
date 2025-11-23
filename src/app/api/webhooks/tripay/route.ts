// src/app/api/webhooks/tripay/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY!;
const TRIPAY_CALLBACK_TOKEN = process.env.TRIPAY_CALLBACK_TOKEN || ""; // optional

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TRIPAY_PRIVATE_KEY) {
  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / TRIPAY_PRIVATE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ===== Helpers Subscription =====
function mapTripayStatusToDb(status: string): "active" | "expired" | "cancelled" | "pending_payment" {
  const s = (status || "").toUpperCase();
  if (s === "PAID" || s === "SUCCESS" || s === "SETTLED") return "active";
  if (s === "EXPIRED") return "expired";
  if (s === "FAILED" || s === "REFUND" || s === "CANCEL" || s === "CANCELED" || s === "CANCELLED") return "cancelled";
  return "pending_payment";
}
function computeExpiryFromPlan(plan?: string): Date | null {
  if (!plan) return null;
  const now = new Date();
  const end = new Date(now);
  switch (plan) {
    case "premium_7_days":   end.setDate(end.getDate() + 7);  return end;
    case "premium_14_days":  end.setDate(end.getDate() + 14); return end;
    case "premium_monthly":  end.setMonth(end.getMonth() + 1); return end;
    case "premium_yearly":   end.setFullYear(end.getFullYear() + 1); return end;
    default: return null;
  }
}
function parseMerchantRefSub(merchantRef?: string): { userId?: string; plan?: string } {
  if (!merchantRef) return {};
  // format SUB: SUB|userId|plan|timestamp
  const parts = merchantRef.split("|");
  if (parts.length >= 3 && parts[0] === 'SUB') {
    return { userId: parts[1], plan: parts[2] };
  }
  return {};
}

// ===== Helpers PPU (orders) =====
function mapTripayToOrderStatus(s: string): 'paid'|'expired'|'failed'|'canceled'|'pending' {
  const up = (s || '').toUpperCase();
  if (up === 'PAID' || up === 'SUCCESS' || up === 'SETTLED') return 'paid';
  if (up === 'EXPIRED') return 'expired';
  if (up === 'FAILED') return 'failed';
  if (up === 'CANCEL' || up === 'CANCELED' || up === 'CANCELLED' || up === 'REFUND') return 'canceled';
  return 'pending';
}
function isPPU(merchantRef?: string) {
  return typeof merchantRef === 'string' && merchantRef.startsWith('PPU|');
}
function parseMerchantRefPPU(merchantRef?: string): { userId?: string; templateId?: string; format?: 'pdf'|'word' } {
  if (!merchantRef) return {};
  // format PPU: PPU|userId|templateId|format|timestamp
  const p = merchantRef.split('|');
  if (p.length >= 5 && p[0] === 'PPU') {
    const fmt = p[3] === 'word' ? 'word' : 'pdf';
    return { userId: p[1], templateId: p[2], format: fmt };
  }
  return {};
}

async function updateOrderByReferenceOrMerchantRef(
  reference: string,
  merchantRef: string | undefined,
  newStatus: 'paid'|'expired'|'failed'|'canceled'|'pending',
  payload: any
) {
  // **FIX 1: Ambil template_id & format dari kolom 'orders', bukan cuma metadata**
  // 1) coba by external_ref
  let { data: ord, error: selErr } = await supabase
    .from('orders')
    .select('id, user_id, metadata, template_id, format') // <-- DIUBAH
    .eq('external_ref', reference)
    .maybeSingle();
  if (selErr) throw selErr;

  // 2) fallback by metadata->merchant_ref
  if (!ord && merchantRef) {
    const { data: ord2, error: selErr2 } = await supabase
      .from('orders')
      .select('id, user_id, metadata, template_id, format') // <-- DIUBAH
      .eq('metadata->>merchant_ref', merchantRef)
      .maybeSingle();
    if (selErr2) throw selErr2;
    ord = ord2 || null;
  }

  if (!ord) return; // Order tidak ditemukan, abaikan.

  // Update status order
  const { error: updErr } = await supabase
    .from('orders')
    .update({ status: newStatus, external_ref: reference, metadata: { ...ord.metadata, webhook_payload: payload } })
    .eq('id', ord.id);
  if (updErr) throw updErr;

  // **FIX 2: Logika PPU. Insert ke ppu_grants, bukan exports_ledger**
  // **FIX 3: Menggunakan try...catch untuk error handling async/await**
  if (newStatus === 'paid') {
    // Gunakan kolom utama 'template_id' dan 'format' dari tabel 'orders'
    const templateId = ord.template_id;
    const format = ord.format;

    if (templateId && format && ord.user_id && ord.id) {
      try {
        // Berikan user hak download di tabel ppu_grants
        await supabase
          .from('ppu_grants') // <-- TABEL YANG BENAR
          .insert({
            user_id: ord.user_id,
            feature: `export_${format}`, // Misal: 'export_pdf' atau 'export_word'
            uses_remaining: 1,
            order_id: ord.id, // Tautkan ke order yang sudah lunas
            created_at: new Date().toISOString(),
          });
      } catch (e) {
        console.error("Gagal insert ke ppu_grants:", e);
        // Jangan throw error, biarkan webhook tetap mengembalikan status 200 OK
      }
    } else {
      console.error("Data order tidak lengkap untuk membuat ppu_grant:", ord);
    }
  }
}

// ===== Webhook =====
export async function POST(req: NextRequest) {
  try {
    // raw body untuk HMAC
    const raw = await req.text();

    // verifikasi header
    const signatureHeader = req.headers.get("x-callback-signature") || "";
    const eventHeader = req.headers.get("x-callback-event") || "";
    const tokenHeader = req.headers.get("x-callback-token") || "";

    if (TRIPAY_CALLBACK_TOKEN && tokenHeader && tokenHeader !== TRIPAY_CALLBACK_TOKEN) {
      return NextResponse.json({ success: false, message: "Invalid callback token" }, { status: 401 });
    }

    const computedSignature = crypto.createHmac("sha256", TRIPAY_PRIVATE_KEY).update(raw).digest("hex");
    if (signatureHeader !== computedSignature) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    if (eventHeader !== "payment_status") {
      return NextResponse.json({ success: true, message: `Ignored event: ${eventHeader}` });
    }

    // payload
    const payload = JSON.parse(raw);
    const reference: string = payload.reference;               // Tripay unique
    const merchantRef: string | undefined = payload.merchant_ref;
    const tripayStatus: string = payload.status;               // PAID/UNPAID/EXPIRED/FAILED/...
    const amount: number | undefined = payload.total_amount;

    // ===== 1) SUBSCRIPTION flow (SUB|userId|plan|ts) =====
    if (merchantRef?.startsWith('SUB|')) {
      const dbStatus = mapTripayStatusToDb(tripayStatus);
      const { userId: mrUserId, plan: mrPlan } = parseMerchantRefSub(merchantRef);

      const { data: existing, error: selErr } = await supabase
        .from("subscriptions")
        .select("id, user_id, plan, status, start_date, end_date")
        .eq("transaction_id", reference)
        .maybeSingle();
      if (selErr) throw selErr;

      let userId = existing?.user_id || mrUserId;
      let plan = existing?.plan || mrPlan;

      const subsUpdate: Record<string, any> = {
        status: dbStatus,
        payment_gateaway: "tripay",
        raw_payload: payload,
      };
      if (amount != null) subsUpdate.amount = amount;
      if (dbStatus === "active") {
        subsUpdate.start_date = new Date().toISOString();
        const endDate = computeExpiryFromPlan(plan);
        if (endDate) subsUpdate.end_date = endDate.toISOString();
      }

      if (existing?.id) {
        const { error: updErr } = await supabase
          .from("subscriptions")
          .update(subsUpdate)
          .eq("id", existing.id);
        if (updErr) throw updErr;

        if (dbStatus === "active" && userId) {
          const finalPlan = plan || existing.plan;
          const expiry = computeExpiryFromPlan(finalPlan);
          const profUpdate: Record<string, any> = {
            active_plan: finalPlan,
            updated_at: new Date().toISOString(),
          };
          if (expiry) profUpdate.plan_expires_at = expiry.toISOString();
          await supabase.from("profiles").update(profUpdate).eq("id", userId);
        }
      } else {
        const insertRow: Record<string, any> = {
          user_id: userId || null,
          plan: plan || "free",
          status: dbStatus,
          start_date: dbStatus === "active" ? new Date().toISOString() : null,
          end_date: null,
          payment_gateaway: "tripay",
          transaction_id: reference,
          amount: amount ?? null,
          raw_payload: payload,
          created_at: new Date().toISOString(),
        };
        if (dbStatus === "active" && plan) {
          const end = computeExpiryFromPlan(plan);
          if (end) insertRow.end_date = end.toISOString();
        }
        const { data: ins, error: insErr } = await supabase
          .from("subscriptions")
          .insert(insertRow)
          .select("id, user_id, plan")
          .single();
        if (insErr) throw insErr;

        if (dbStatus === "active" && (userId || ins?.user_id)) {
          const upUserId = userId || ins?.user_id;
          const finalPlan = plan || ins?.plan;
          const expiry = computeExpiryFromPlan(finalPlan);
          const profUpdate: Record<string, any> = {
            active_plan: finalPlan,
            updated_at: new Date().toISOString(),
          };
          if (expiry) profUpdate.plan_expires_at = expiry.toISOString();
          await supabase.from("profiles").update(profUpdate).eq("id", upUserId as string);
        }
      }
    }

    // ===== 2) PPU flow (PPU|userId|templateId|format|ts) =====
    if (isPPU(merchantRef)) {
      const orderStatus = mapTripayToOrderStatus(tripayStatus);
      await updateOrderByReferenceOrMerchantRef(reference, merchantRef, orderStatus, payload);
}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Tripay Webhook] Error:", err);
    return NextResponse.json({ success: false, message: err?.message || "Webhook error" }, { status: 500 });
  }
}