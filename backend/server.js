const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Importujemy trasy
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Start serwera i połączenie z MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Połączono z MongoDB');
    app.listen(3000, () => {
      console.log('🚀 Serwer działa na http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('❌ Błąd połączenia z MongoDB:', err);
  });
app.get("/", (req, res) => {
  res.send("Backend działa 😎");
});
