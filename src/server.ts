import Express, {Request, Response} from "express";
import { UserController } from "./controllers/UserController";

const userController = new UserController();

const server =  Express();

server.use(Express.json());


server.get("/", userController.getUser)

server.post("/pdf", userController.createUser)

server.listen(5000, () => console.log("Servidor rodando :)"))