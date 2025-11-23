import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../../lib/supabaseServer";

type Body = {
  templateId: string;
  format: "pdf" | "word";
  payment_method?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { templateId, format, payment_method }: Body = await req.json();
    if (!templateId || !["pdf", "word"].includes(format)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const admin = supabaseAdmin();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
    }
    const accessToken = authHeader.split(" ")[1];

    const { data: userRes, error: userErr } = await admin.auth.getUser(accessToken);
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = userRes.user;

    const { data: tmpl, error: tErr } = await admin
      .from("templates")
      .select("id,name,slug,tier,supports_word,price_pdf,price_word")
      .eq("id", templateId)
      .single();

    if (tErr || !tmpl) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    if (format === "word" && !tmpl.supports_word) {
      return NextResponse.json({ error: "Template does not support Word" }, { status: 400 });
    }

    const amount = format === "pdf" ? Number(tmpl.price_pdf || 0) : Number(tmpl.price_word || 0);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const merchantRef = `PPU|${user.id}|${tmpl.id}|${format}|${Date.now()}`;

    const BASE = process.env.TRIPAY_API_BASE || "https://tripay.co.id/api-sandbox";
    const APIKEY = process.env.TRIPAY_API_KEY!;
    const PRIV = process.env.TRIPAY_PRIVATE_KEY!;
    const MC = process.env.TRIPAY_MERCHANT_CODE!;
    const APPURL = process.env.NEXT_PUBLIC_APP_URL!;

    if (!APIKEY || !PRIV || !MC || !APPURL) {
      return NextResponse.json({ error: "Missing Tripay/App env" }, { status: 500 });
    }

    const signature = crypto
      .createHmac("sha256", PRIV)
      .update(MC + merchantRef + String(amount))
      .digest("hex");

    const payload = {
      method: payment_method || "QRIS",
      merchant_ref: merchantRef,
      amount,
      customer_name: user.user_metadata?.full_name || user.email,
      customer_email: user.email,
      order_items: [
        {
          sku: `${tmpl.slug}-${format}`,
          name: `${tmpl.name} - ${format.toUpperCase()} Export`,
          price: amount,
          quantity: 1,
          subtotal: amount,
        },
      ],
      callback_url: `${APPURL}/api/webhooks/tripay`,
      return_url: `${APPURL}/payments/return?merchant_ref=${encodeURIComponent(merchantRef)}`,
      expired_time: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      signature,
    };

    const resp = await fetch(`${BASE}/transaction/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${APIKEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await resp.json();

    if (!resp.ok || !json?.data?.reference || !json?.data?.checkout_url) {
      console.error("Tripay create failed:", json);
      return NextResponse.json({ error: "Tripay create failed" }, { status: 502 });
    }

    const reference = json.data.reference;
    const checkoutUrl = json.data.checkout_url;

    const { error: oErr } = await admin.from("orders").insert({
      user_id: user.id,
      gateway: "TRIPAY",
      feature: `export_${format}`,
      amount,
      currency: "IDR",
      status: "pending",
      external_ref: reference,
      metadata: {
        template_id: tmpl.id,
        format,
        merchant_ref: merchantRef,
        checkout_url: checkoutUrl,
      },
    });

    if (oErr) {
      console.error("Insert orders failed:", oErr);
      return NextResponse.json({ error: "Failed creating order" }, { status: 500 });
    }

    return NextResponse.json({ redirectUrl: checkoutUrl, reference, merchantRef });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
