import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'

import dotenv from 'dotenv';
import { connectToMongoDB } from './lib/db.js';

dotenv.config();


const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors())


app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

const port = 3000;
app.listen(port, () => {
    connectToMongoDB()
    console.log(`API server is running at http://localhost:${port}`);
});
