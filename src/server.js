import express from 'express';
import { users } from './mockData/Users.js'
import cors from 'cors'
import { router as apiRoutes } from './routes/index.js'
import { connectDB } from './config/mongodb.js';
import { connectSupabase } from './config/supabase.js'
import { home } from './utils/home.js'
import cookieParser from 'cookie-parser'
import { limiter } from './middlewares/rate.Limiter.js'
import helmet from "helmet";



const app = express();

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  ...(process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));
app.use(limiter);



app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send(home)
});

//Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error!",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: err.stack,
  });
});


await connectDB();
await connectSupabase();



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🌏`);
});
