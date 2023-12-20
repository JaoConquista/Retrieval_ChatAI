import { Request, Response, response } from "express";
import { UserService } from "../services/UserService/UserService";
import multer from "multer";

export class UserController {
  userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }
  createUser = (request: Request, response: Response) => {
    const user = request.body;

    if (!user.name)
      return response
        .status(400)
        .json({ message: "Bad Request: Name required" });

    if (!user.email)
      return response
        .status(400)
        .json({ message: "Bad Request: Email required" });

    this.userService.createUser(user.name, user.email);
    return response
      .status(201)
      .json({ message: "Arquivo enviado com sucesso !" });
  };

  getUser = (response: Response) => {
    const users = this.userService.getAllUsers();
    return response.status(201).json(users);
  };

  chat = (request: Request, response: Response) => {
    const userService = new UserService();

    const question: string = request.body.question;

    const answer = userService.chat(question);

    answer.then((answer) => {
      return response.status(201).json({ chat: answer });
    });
  };

  upload = (request: Request, response: Response) => {
    const userService = new UserService();

    const upload = userService.uploadFile("file");

    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        return response.status(500).json(err);
      } else if (err) {
        return response.status(500).json(err);
      }

      return response.status(200).json({ message: "File Uploaded Successfully"});
    });
  }
}
