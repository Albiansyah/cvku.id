import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Inisialisasi Supabase ADMIN client
// Pastikan variabel environment ini sudah di-set di Vercel/server lu
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // INI HARUS SERVICE ROLE KEY
);

// --- Konfigurasi Tripay ---
const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY!;
const TRIPAY_API_BASE =
  process.env.TRIPAY_API_BASE || "https://tripay.co.id/api-sandbox";

// --- Tipe Data ---
type TripayData = {
  reference: string;
  merchant_ref: string;
  amount: number;
  status:
    | "UNPAID"
    | "PAID"
    | "EXPIRED"
    | "FAILED"
    | "REFUND"
    | "PARTIAL_REFUND"
    | "PENDING"
    | "SUCCESS"
    | string;
  is_closed?: boolean;
  payment_method?: string;
  payment_name?: string;
  paid_at?: number; 
};

type TripayDetail = {
  success: boolean;
  message?: string;
  data?: TripayData | null;
};

// --- Helper Functions ---
function parseMerchantRef(ref?: string) {
  if (!ref) return {};
  try {
    const clean = decodeURIComponent(ref);
    const parts = clean.split("|"); // PPU|<userId>|<templateId>|<format>|<ts>
    return {
      user_id: parts[1],
      template_id: parts[2],
      format: parts[3],
      ts: parts[4],
    };
  } catch {
    return {};
  }
}

function asTripayData(d: TripayDetail["data"]): TripayData {
  return {
    reference: d?.reference ?? "",
    merchant_ref: d?.merchant_ref ?? "",
    amount: typeof d?.amount === "number" ? d!.amount : NaN,
    status: (d?.status ?? "").toString(),
    is_closed: d?.is_closed,
    payment_method: d?.payment_method,
    payment_name: d?.payment_name,
    paid_at: d?.paid_at,
  };
}

// --- API Endpoint ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    // 1. Validasi Input
    if (!reference) {
      return NextResponse.json(
        { ok: false, message: "Missing reference" },
        { status: 400 }
      );
    }
    if (!TRIPAY_API_KEY) {
      return NextResponse.json(
        { ok: false, message: "TRIPAY_API_KEY belum di-set" },
        { status: 500 }
      );
    }

    // 2. Cek ke Tripay
    const res = await fetch(
      `${TRIPAY_API_BASE}/transaction/detail?reference=${encodeURIComponent(
        reference
      )}`,
      { headers: { Authorization: `Bearer ${TRIPAY_API_KEY}` }, cache: "no-store" }
    );

    const json = (await res.json()) as TripayDetail;

    if (!res.ok || !json?.success) {
      return NextResponse.json(
        {
          ok: false,
          status: "PENDING",
          message: json?.message || "Menunggu konfirmasi pembayaran dari Tripay...",
          data: {},
        },
        { status: 200 }
      );
    }

    // 3. Normalisasi Status
    const d = asTripayData(json.data);
    const normalized = (d.status ?? "").toString().toUpperCase();
    const statusMap: Record<
      string,
      "PAID" | "UNPAID" | "EXPIRED" | "FAILED" | "PENDING" | "UNKNOWN"
    > = {
      PAID: "PAID",
      SUCCESS: "PAID",
      UNPAID: "UNPAID",
      EXPIRED: "EXPIRED",
      FAILED: "FAILED",
      REFUND: "FAILED",
      PARTIAL_REFUND: "FAILED",
      PENDING: "PENDING",
    };
    const mapped = statusMap[normalized] ?? "UNKNOWN";
    const extra = parseMerchantRef(d.merchant_ref);

    // 4. [PERBAIKAN] Update Database Jika LUNAS
    if (mapped === "PAID") {
      try {
        const { error: updateError } = await supabaseAdmin
          .from("orders") // <-- Cocok dengan schema lu
          .update({ 
            status: "PAID" // <-- Cocok dengan schema lu
            // Baris 'paid_at' dihapus karena tidak ada di schema 'orders' lu
          })
          .eq("merchant_ref", d.merchant_ref); // <-- Cocok dengan schema lu

        if (updateError) {
          console.error(
            `[VERIFY_PAYMENT_ERROR] Gagal update DB untuk merchant_ref ${d.merchant_ref}:`, 
            updateError.message
          );
        } else {
          console.log(
            `[VERIFY_PAYMENT_SUCCESS] Berhasil update DB untuk merchant_ref ${d.merchant_ref}`
          );
        }

      } catch (dbError: any) {
        console.error(
          `[VERIFY_PAYMENT_FATAL] Error koneksi Supabase saat update merchant_ref ${d.merchant_ref}:`, 
          dbError.message
        );
      }
    }

    // 5. Kembalikan Respon ke Halaman /payments/return
    return NextResponse.json({
      ok: true,
      status: mapped,
      data: {
        amount: Number.isFinite(d.amount) ? d.amount : undefined,
        method: d.payment_name || d.payment_method || undefined,
        timestamp: d.paid_at
          ? new Date(d.paid_at * 1000).toISOString()
          : undefined,
        template_id: (extra as any).template_id,
        format: (extra as any).format,
      },
    });

  } catch (e: any) {
    // Error global
    return NextResponse.json(
      {
        ok: false,
        status: "PENDING",
        message: e?.message || "Verify error",
        data: {},
      },
      { status: 200 }
    );
  }
}