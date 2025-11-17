const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// Route files
const providers = require('./routes/providers');
const { connect } = require('mongoose');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');

// Load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

app.set('query parser', 'extended');

// app.get('/', (req, res) => { // short func
//     res.send('eiei'); // try
//     // res.status(200).json({
//     //     success: true,
//     //     data:{id:1}
//     // });
// });

// app.get('/providers', async (req, res) => {
//   const providers = await db.query('SELECT * FROM providers');
//   res.json(providers.rows);
// });

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  credentials: true
}));


// mount routers
app.use('/api/v1/providers', providers); // so in hospitals.js we do not have to put /api.. anymore
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);

const PORT = process.env.PORT || 5003; // port from same port as .env
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    // close server & exit process
    server.close(()=>process.exit(1));
});