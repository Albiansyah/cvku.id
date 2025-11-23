// src/app/api/payments/status/route.ts
import { NextResponse } from 'next/server';

const TRIPAY_API_BASE =
  process.env.TRIPAY_MODE === 'production'
    ? 'https://tripay.co.id/api'
    : 'https://tripay.co.id/api-sandbox';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const reference = url.searchParams.get('reference') || url.searchParams.get('tripay_reference');
    if (!reference) {
      return NextResponse.json({ ok: false, error: 'Missing reference' }, { status: 400 });
    }

    const apiKey = process.env.TRIPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'TRIPAY_API_KEY missing' }, { status: 500 });
    }

    // PULL status transaksi langsung dari Tripay
    const res = await fetch(`${TRIPAY_API_BASE}/transaction/detail?reference=${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: 'Tripay error', detail: json },
        { status: 502 }
      );
    }

    // Contoh status Tripay: "UNPAID" | "PAID" | "EXPIRED" | "REFUND" | dst
    const trx = json?.data ?? {};
    const status: string = String(trx.status || '').toUpperCase();

    const isPaid = status === 'PAID' || status === 'SUCCESS' || status === 'SETTLEMENT';

    return NextResponse.json({
      ok: true,
      paid: isPaid,
      status,
      amount: trx.amount ?? trx.total_amount ?? null,
      reference: trx.reference,
      merchant_ref: trx.merchant_ref,
      payment_method: trx.payment_name || trx.payment_method || null,
      raw: trx,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
