import "reflect-metadata";
import Express from "express";
import { router } from "./routes";
import { AppDataSource } from "./database/datasource";

const server = Express();



server.use(Express.json());

server.use(router);

server.listen(5000, () => console.log("Server on"));
