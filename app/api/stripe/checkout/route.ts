// app/api/stripe/checkout/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET environment variable");
}

// IMPORTANT: do NOT pass an apiVersion string that conflicts with your installed stripe typings.
// Let the installed stripe package use its default API version.
const stripe = new Stripe(stripeSecret, {
  // no apiVersion here — avoids TypeScript literal mismatches
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Build line_items safely (server-side validation)
    const line_items = items.map((it: any) => {
      const name = String(it.name ?? "Product");
      const qty = Math.max(1, Number(it.quantity ?? it.qty ?? 1));
      const unit_amount = Number(it.unit_amount_cents ?? it.price_cents ?? it.unit_amount ?? 0);

      if (!unit_amount || unit_amount <= 0) {
        throw new Error("Invalid item price");
      }

      return {
        price_data: {
          currency: "usd",
          product_data: { name },
          unit_amount: Math.round(unit_amount),
        },
        quantity: qty,
      };
    });

    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err?.message ?? "server error" }, { status: 500 });
  }
}
