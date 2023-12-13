import { Request, Response, response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  createUser = (request: Request, response: Response) => {
    const userService = new UserService();
    const user = request.body;

    if (!user.name)
      return response
        .status(400)
        .json({ message: "Bad Request: Name required" });

    if (!user.email)
      return response
        .status(400)
        .json({ message: "Bad Request: Email required" });

    userService.createUser(user.name, user.email);
    return response
      .status(200)
      .json({ message: "Arquivo enviado com sucesso !" });
  };

  getUser = (request: Request, response: Response) => {
    const userService = new UserService();
    const users = userService.getAllUsers();
    return response.status(200).json(users);
  };

  chat = (request: Request, response: Response) => {
    const userService = new UserService();
    const question: string = request.body.question;

    const answer = userService.chat(question);

    answer.then((answer) => {
      return response.status(200).json({ chat: answer });
    });
  };
}
