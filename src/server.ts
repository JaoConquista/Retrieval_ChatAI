import Express, {Request, Response} from "express";
import { UserController } from "./controllers/UserController";
import { router } from "./routes";


const server =  Express();

//allowing json
server.use(Express.json());

server.use(router)

server.listen(5000, () => console.log("Servidor rodando :)"))