// src/app/api/create-payment/route.js

import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { planName, price } = await request.json();

    const apiKey = process.env.TRIPAY_API_KEY;
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;
    const merchantCode = process.env.NEXT_PUBLIC_TRIPAY_MERCHANT_CODE;

    if (!apiKey || !privateKey || !merchantCode) {
        throw new Error("Kredensial Tripay tidak disetel di environment variables.");
    }

    const merchantRef = `CVB-${Date.now()}`;
    
    // --- PERBAIKAN UTAMA DI SINI ---
    // String yang di-signature TIDAK BOLEH mengandung Private Key.
    const signatureString = merchantCode + merchantRef + price;

    // Private Key hanya digunakan sebagai kunci untuk fungsi HMAC-SHA256.
    const signature = crypto.createHmac('sha256', privateKey)
                            .update(signatureString)
                            .digest('hex');
    // --- AKHIR PERBAIKAN ---

    const payload = {
      method: 'QRIS', // QRIS Dinamis lebih disarankan untuk sandbox
      merchant_ref: merchantRef,
      amount: price,
      customer_name: 'Budi Santoso', // Nanti ambil dari data user yang login
      customer_email: 'budi.santoso@example.com',
      order_items: [
        {
          name: planName,
          price: price,
          quantity: 1,
        },
      ],
      // URL callback bisa disetel di sini atau di dashboard Tripay
      // callback_url: 'https://domainkamu.com/api/payment-callback', 
      signature: signature,
    };
    
    const response = await fetch('https://tripay.co.id/api-sandbox/transaction/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Tripay Error:", data.message);
      return NextResponse.json({ error: `Gagal membuat transaksi: ${data.message}` }, { status: 400 });
    }

    return NextResponse.json({ checkout_url: data.data.checkout_url });

  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}