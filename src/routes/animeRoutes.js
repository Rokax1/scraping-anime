
import express from 'express';
import { getAnimes } from '../controllers/animeController.js';
const router = express.Router();


router.get('/', getAnimes);

export default router;