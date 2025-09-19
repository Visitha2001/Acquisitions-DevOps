import { singup } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', singup);
router.post('/sign-in', (req, res) => {});
router.post('/sign-out', (req, res) => {});

export default router;