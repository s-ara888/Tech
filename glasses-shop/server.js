const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "Classic Aviator", price: 120 },
  { id: 2, name: "Retro Round", price: 95 },
  { id: 3, name: "Cat Eye Chic", price: 110 },
];

let cart = [];

// Get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// Get cart
app.get("/cart", (req, res) => {
  res.json(cart);
});

// Add to cart
app.post("/cart", (req, res) => {
  const { id, name, price } = req.body;
  cart.push({ id, name, price });
  res.json({ message: `${name} added!` });
});

// Remove from cart by index
app.delete("/cart/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    res.json({ message: "Item removed" });
  } else {
    res.status(400).json({ message: "Invalid index" });
  }
});

// Checkout
app.post("/cart/checkout", (req, res) => {
  console.log("Order received:", cart);
  cart = []; // clear after checkout
  res.json({ message: "✅ Order placed successfully!" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

