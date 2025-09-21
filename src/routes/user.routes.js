import express from 'express';
import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '#controllers/users.controller.js';
import {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin,
} from '#middleware/auth.middleware.js';

const router = express.Router();

// Public route (might need authentication later based on requirements)
router.get('/', authenticateToken, requireAdmin, getAllUsersController);

// Protected routes - users can access their own data, admins can access any
router.get(
  '/:id',
  authenticateToken,
  requireOwnershipOrAdmin,
  getUserByIdController
);
router.put(
  '/:id',
  authenticateToken,
  requireOwnershipOrAdmin,
  updateUserController
);
router.delete(
  '/:id',
  authenticateToken,
  requireOwnershipOrAdmin,
  deleteUserController
);

export default router;
