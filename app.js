// app.js

import express from 'express';
import "./associations.js";

import animeRoutes from './src/routes/animeRoutes.js';

const app = express();

app.use(express.json());

app.use('/anime', animeRoutes);

export default app;