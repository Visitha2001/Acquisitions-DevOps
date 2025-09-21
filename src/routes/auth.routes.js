import { singup, signin, signout } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', singup);
router.post('/sign-in', signin);
router.post('/sign-out', signout);

export default router;
