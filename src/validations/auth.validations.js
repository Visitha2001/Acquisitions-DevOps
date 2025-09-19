import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().max(255).trim().nonempty("Name is required"),
    email: z.string().max(255).toLowerCase().trim().nonempty("Email is required").email("Invalid email address"),
    password: z.string().min(6).max(255).nonempty("Password is required"),
    role: z.enum(["user", "admin"]).default("user")
});

export const signinSchema = z.object({
    email: z.string().max(255).toLowerCase().trim().nonempty("Email is required").email("Invalid email address"),
    password: z.string().min(6).max(255).nonempty("Password is required")
});