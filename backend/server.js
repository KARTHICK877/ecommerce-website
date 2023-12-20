// app.js

require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const { connectToMongo, mongoClient } = require("./db"); // Update the path accordingly

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    // Ensure that MongoDB is connected before processing the request
    if (!mongoClient.isConnected) {
      await connectToMongo();
    }

    // Your existing Stripe checkout session creation logic
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Start the MongoDB connection and then the server
connectToMongo().then(() => {
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});
