import { signupSchema } from "#validations/auth.validations.js";
import { formatValidationErrors } from "#utils/format.js";
import logger from "#config/logger.js";
import { createUser } from "#services/auth.service.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const singup = async (req, res, next) => {
    try {
        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ 
                message: validationResult.error.message,
                details: formatValidationErrors(validationResult.error.errors)
            });
        }
        const { name, email, password, role } = validationResult.data;
        
        const user = await createUser({ name, email, password, role });
        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });
        cookies.set(res, 'token', token);

        logger.info(`user registered successfully : ${email}`);
        res.status(201).json({ 
            message: 'User registered successfully' , 
            user: user.id, 
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (e) {
        logger.error("Error in singup", e);
        if (e.messge === 'User with this email already exists') {
            return res.status(400).json({ message: 'User with this email already exists'});
        }
        next(e);
    }
}