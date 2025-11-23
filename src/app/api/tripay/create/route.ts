// app/api/tripay/create/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

type PlanEnum =
  | "premium_7_days"
  | "premium_14_days"
  | "premium_monthly"
  | "premium_yearly";

const TRIPAY_BASE = "https://tripay.co.id/api-sandbox";
const CREATE_URL = `${TRIPAY_BASE}/transaction/create`;

const API_KEY = process.env.TRIPAY_API_KEY!;
const PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY!;
const MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE!;
const APP_URL = process.env.APP_URL || "http://localhost:3000";

// ——— Harga sandbox (semua Rp 1 seperti request lo)
const PRICE_MAP: Record<PlanEnum, number> = {
  premium_7_days: 1000,
  premium_14_days: 1000,
  premium_monthly: 1000,
  premium_yearly: 1000,
};

// optional: batasan method pembayaran; default QRIS biar simple di sandbox
const DEFAULT_METHOD = "QRIS";

// Helper: signature = HMAC_SHA256(merchant_code + merchant_ref + amount, private_key)
function sign(merchantRef: string, amount: number) {
  const payload = MERCHANT_CODE + merchantRef + amount;
  return crypto.createHmac("sha256", PRIVATE_KEY).update(payload).digest("hex");
}

// Health check (biar gampang test dari browser)
// GET /api/tripay/create => { ok: true }
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  try {
    // Ambil payload dari pricing page
    const body = await req.json().catch(() => ({}));
    const plan = (body?.plan || "").trim() as PlanEnum;
    const sku = (body?.sku || "").trim();
    const method = (body?.method || DEFAULT_METHOD).trim(); // bisa override kalau mau
    const userId = (req.headers.get("x-user-id") || "").trim();

    // Validasi basic
    if (!plan || !(plan in PRICE_MAP)) {
      return NextResponse.json(
        { error: "Plan tidak valid / tidak dikenali." },
        { status: 400 }
      );
    }
    if (!API_KEY || !PRIVATE_KEY || !MERCHANT_CODE) {
      return NextResponse.json(
        { error: "Konfigurasi Tripay belum lengkap di environment." },
        { status: 500 }
      );
    }

    // Nominal sandbox
    const amount = PRICE_MAP[plan];

    // merchant_ref unik
    const merchantRef = `CVB-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

    // Signature
    const signature = sign(merchantRef, amount);

    // (Optional) data customer; isi minimal biar nyaman tes
    const customer_name = userId ? `User ${userId.slice(0, 6)}` : "Guest";
    const customer_email = userId ? `${userId.slice(0, 6)}@example.com` : "guest@example.com";
    const customer_phone = "081234567890";

    // Item order ditampilkan di Tripay (bebas, buat log)
    const order_items = [
      {
        sku: sku || plan,
        name: `CVBuilder ${plan.replaceAll("_", " ").toUpperCase()}`,
        price: amount,
        quantity: 1,
        subtotal: amount,
      },
    ];

    // URL kembali & callback (webhook)
    const return_url = `${APP_URL}/payments/return?ref=${merchantRef}`;
    const callback_url = `${APP_URL}/api/webhooks/tripay`; // pastikan route webhook sudah ada

    // Payload sesuai dokumentasi Tripay
    const payload = {
      method,               // contoh: "QRIS", "BRIVA", dll
      merchant_ref: merchantRef,
      amount,
      customer_name,
      customer_email,
      customer_phone,
      order_items,
      return_url,
      callback_url,
      expired_time: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 jam
      signature,
    };

    // Panggil Tripay sandbox
    const res = await fetch(CREATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
      // NOTE: Next.js fetch default sudah oke; ga perlu cache khusus
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Tripay error:", data);
      return NextResponse.json(
        { error: data?.message || "Tripay error" },
        { status: 502 }
      );
    }

    // Format respon Tripay sandbox biasanya:
    // { success: true, data: { reference, pay_code, checkout_url, ... } }
    const payment_url =
      data?.data?.checkout_url ||
      data?.data?.pay_url || // jaga-jaga
      null;

    if (!payment_url) {
      console.error("Tripay response tidak punya payment url:", data);
      return NextResponse.json(
        { error: "Tidak menerima payment_url dari Tripay." },
        { status: 502 }
      );
    }

    // Kembalikan ke FE
    return NextResponse.json({
      ok: true,
      reference: data?.data?.reference,
      payment_url,
      amount,
      method,
      merchant_ref: merchantRef,
    });
  } catch (err: any) {
    console.error("CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Internal error saat membuat transaksi." },
      { status: 500 }
    );
  }
}
