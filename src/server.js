const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Server running on port 3000"));
