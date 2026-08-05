import { PLANS } from "../config/Plans.js"
import stripe from "../config/stripe.js"
import axios from "axios"
import Payment from "../models/payment.model.js"

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body
    const userId = req.headers["x-user-id"]

    const selectedPlan = PLANS[plan]

    if (!selectedPlan) {
      return res.status(404).json({ message: "plan not found!" })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Nexus.ai ${selectedPlan.name} plan`,
            },
            unit_amount: selectedPlan.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId:userId.toString(),
        credits: String(selectedPlan.credits),
        plan: selectedPlan.name,
      },
      success_url: `${process.env.CLIENT_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    })

    await Payment.create({
      userId,
      orderId: session.id,
      paymentId: "",
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.name,
      currency: session.currency?.toUpperCase() || "USD",
      status: "created",
    })

    return res.status(200).json({
      sessionUrl: session.url,
      orderId: session.id,
      plan:selectedPlan
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: `Create order error: ${error.message}` })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query
    const userId = req.headers["x-user-id"]

    if (!session_id) {
      return res.status(400).json({ message: "session_id is required" })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    const payment = await Payment.findOne({ orderId: session_id })

    if (!payment) {
      return res.status(404).json({ message: "payment not found" })
    }

    if (session.payment_status === "paid" && payment.status !== "paid") {
      await Payment.findByIdAndUpdate(payment._id, {
        status: "paid",
        paymentId: session.payment_intent,
      })

      await axios.post(`${process.env.AUTH_SERVICE}/update-plan`, {
        userId: payment.userId,
        plan: payment.plan,
        credits: payment.credits,
      })
    }

    const updated = await Payment.findById(payment._id)

    return res.status(200).json({
      status: updated.status,
      credits: updated.credits,
      plan: updated.plan,
      paid: updated.status === "paid",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: `Billing error: ${error.message}` })
  }
}

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    await Payment.findOneAndUpdate(
      { orderId: session.id },
      {
        status: "paid",
        paymentId: session.payment_intent,
      },
      { new: true }
    )
  }

  res.json({ received: true })
}
