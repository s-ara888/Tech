// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

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
