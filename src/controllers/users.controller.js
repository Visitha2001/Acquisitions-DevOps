import logger from '#config/logger.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '#services/user.service.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';
import { formatValidationErrors } from '#utils/format.js';

export const getAllUsersController = async (req, res, next) => {
  try {
    logger.info('Fetching all users');
    const allUsers = await getAllUsers();
    res.status(200).json({
      message: 'All users fetched successfully',
      data: allUsers,
      count: allUsers.length
    });
  } catch (error) {
    logger.error('Error fetching all users', error);
    next(error);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        message: validationResult.error.message,
        details: formatValidationErrors(validationResult.error.errors)
      });
    }
        
    const { id } = validationResult.data;
    logger.info(`Fetching user with ID: ${id}`);
        
    const user = await getUserById(id);
    res.status(200).json({
      message: 'User fetched successfully',
      data: user
    });
  } catch (error) {
    logger.error('Error fetching user by ID', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    // Validate user ID from params
    const idValidationResult = userIdSchema.safeParse(req.params);
    if (!idValidationResult.success) {
      return res.status(400).json({
        message: idValidationResult.error.message,
        details: formatValidationErrors(idValidationResult.error.errors)
      });
    }
        
    // Validate update data from body
    const updateValidationResult = updateUserSchema.safeParse(req.body);
    if (!updateValidationResult.success) {
      return res.status(400).json({
        message: updateValidationResult.error.message,
        details: formatValidationErrors(updateValidationResult.error.errors)
      });
    }
        
    const { id } = idValidationResult.data;
    const updates = updateValidationResult.data;
        
    // Authorization: users can only update their own data, except admins
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own information.'
      });
    }
        
    // Only admins can change roles
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Only administrators can change user roles.'
      });
    }
        
    logger.info(`Updating user with ID: ${id}`);
        
    const updatedUser = await updateUser(id, updates);
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    logger.error('Error updating user', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.message === 'Email already exists') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        message: validationResult.error.message,
        details: formatValidationErrors(validationResult.error.errors)
      });
    }
        
    const { id } = validationResult.data;
        
    // Authorization: users can only delete their own account, except admins
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own account.'
      });
    }
        
    logger.info(`Deleting user with ID: ${id}`);
        
    const deletedUser = await deleteUser(id);
    res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    logger.error('Error deleting user', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    next(error);
  }
};
