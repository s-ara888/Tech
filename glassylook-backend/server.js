// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const Product = require('./models/Product');
const Cart = require('./models/Cart');


// Middleware to parse JSON
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Connect to MongoDB Atlas (replace <username>, <password>, <cluster> with your info)
mongoose.connect('mongodb+srv://sarahmjh986_db_user:iGWHVkeAqhKj2Uf3@cluster0.vypdasy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add product to cart
app.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne(); // single cart for simplicity
  if (!cart) {
    cart = new Cart({ products: [] });
  }

  const existingProduct = cart.products.find(p => p.productId == productId);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// Get cart
app.get('/cart', async (req, res) => {
  const cart = await Cart.findOne().populate('products.productId');
  res.json(cart);
});

