import logger from '#config/logger.js'
import { getAllUsers } from '#services/user.service.js'

export const getAllUsersController = async (req, res, next) => {
    try {
        logger.info("Fetching all users");
        const allUsers = await getAllUsers();
        res.status(200).json({
            message: "All users fetched successfully",
            data: allUsers,
            count: allUsers.length
        });
    } catch (error) {
        logger.error("Error fetching all users", error);
        throw new Error("Error fetching all users");
    }
}