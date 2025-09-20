import express from 'express';
import { getAllUsersController } from '#controllers/users.controller.js';

const router = express.Router();

router.get("/", getAllUsersController);

router.get("/:id", (req, res) => {
    res.send("GET /users/:id");
});

router.put("/:id", (req, res) => {
    res.send("PUT /users/:id");
});

router.delete("/:id", (req, res) => {
    res.send("DELETE /users/:id");
});

export default router;