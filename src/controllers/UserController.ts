import {Request, Response} from "express";


export class UserController {

  createUser = (request: Request, response: Response) => {
    const body = request.body;

    return response.status(200)
      .json({ message: "Arquivo enviado com sucesso !" });
  };

  getUser = (request: Request, response: Response) => {
    console.log("Get method")
    return response.status(200).json({ message: "Files PDF"})
  }
}

