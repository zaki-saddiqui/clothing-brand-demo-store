// app/api/stripe/checkout/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

if (!process.env.STRIPE_SECRET) {
  console.warn("STRIPE_SECRET is not set. Checkout will fail in live mode.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET || "sk_test_placeholder", { apiVersion: "2022-11-15" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lineItems } = body; // expect [{ name, priceCents, quantity, variantId }]

    const items = lineItems.map((it: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: it.name,
          metadata: { variantId: it.variantId }
        },
        unit_amount: it.priceCents
      },
      quantity: it.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/product/cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "unknown" }, { status: 500 });
  }
}
