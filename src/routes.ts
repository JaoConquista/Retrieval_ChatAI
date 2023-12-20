import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { storage } from "./config/multerConfig";
import multer from 'multer';

const userController = new UserController();
const upload = multer({ storage });

export const router = Router();

router.route("/")
.get(userController.getUser)
.post(userController.createUser)    

router.route("/chat")
.post(userController.chat)

router.route("/file")
.post(upload.single('file'), (Request, Response) => {
    return Response.json({message: "File uploaded successfully"});
});