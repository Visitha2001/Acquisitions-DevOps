import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '#services/auth.service.js';

export const getAllUsers = async () => {
  try {
    return await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at
    }).from(users);
  } catch (error) {
    logger.error('Error fetching all users', error);
    throw new Error('Error fetching all users');
  }
};

export const getUserById = async (id) => {
  try {
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at
    }).from(users).where(eq(users.id, id)).limit(1);
        
    if (!user) {
      throw new Error('User not found');
    }
        
    return user;
  } catch (error) {
    logger.error(`Error fetching user with ID ${id}`, error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists first
    const existingUser = await getUserById(id);
        
    // Prepare update data
    const updateData = { ...updates };
        
    // Hash password if it's being updated
    if (updates.password) {
      updateData.password = await hashPassword(updates.password);
    }
        
    // Add updated_at timestamp
    updateData.updated_at = new Date();
        
    // Check for email uniqueness if email is being updated
    if (updates.email && updates.email !== existingUser.email) {
      const [emailExists] = await db.select().from(users)
        .where(eq(users.email, updates.email)).limit(1);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }
        
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
      });
        
    logger.info(`User with ID ${id} updated successfully`);
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user with ID ${id}`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    // Check if user exists first
    await getUserById(id);
        
    const [deletedUser] = await db.delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      });
        
    logger.info(`User with ID ${id} deleted successfully`);
    return deletedUser;
  } catch (error) {
    logger.error(`Error deleting user with ID ${id}`, error);
    throw error;
  }
};
