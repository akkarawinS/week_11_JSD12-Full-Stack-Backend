import express from 'express';
import { users } from './mockData/Users.js'
import cors from 'cors'
import { router as apiRoutes } from './routes/index.js'
import { connectDB } from './config/mongodb.js';
import { connectSupabase } from './config/supabase.js'
import cookieParser from 'cookie-parser'
import { limiter } from './middlewares/rateLimiter.js'
import helmet from 'helmet'


const app = express();

app.use(helmet());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));
app.use(limiter);



app.use('/api', apiRoutes);

app.get('/', (req, res) => {  
  res.send('Backend API is running')
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
