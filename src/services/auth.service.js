import bcrypt from "bcrypt";
import logger from "#config/logger.js";
import { eq } from "drizzle-orm";
import { db } from "#config/database.js";
import { users } from "#models/user.model.js";

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error("Error while hashing password", error);
        throw new Error("Error while hashing password");
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error("Error while comparing password", error);
        throw new Error("Error while comparing password");
    }
};

export const createUser = async ({name, email, password, role = 'user'}) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            throw new Error("User with this email already exists");
        }
        const hashedPassword = await hashPassword(password);
        const [user] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role
        }).returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at
            });
        logger.info(`User created successfully : ${email}`);
        return user;
    } catch (error) {
        logger.error("Error while creating user", error);
        throw new Error("Error while creating user");
    }
};

export const authenticateUser = async (email, password) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        logger.info(`User authenticated successfully : ${email}`);
        return userWithoutPassword;
    } catch (error) {
        logger.error("Error while authenticating user", error);
        throw error;
    }
};
