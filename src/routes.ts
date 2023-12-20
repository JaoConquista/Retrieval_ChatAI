import { Router } from "express";
import { UserController } from "./controllers/UserController";

const userController = new UserController();


export const router = Router();

router.route("/")
.get(userController.getUser)
.post(userController.createUser)    

router.route("/chat")
.post(userController.chat)

router.route("/file")
.post(userController.upload );