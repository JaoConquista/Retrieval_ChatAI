import { chatInstance } from "..";

const db = [
  {
    name: "João",
    email: "joao@gmail.com",
  },
  {
    name: "Maria",
    email: "maria@gmail.com",
  },
];

export class UserService {
  createUser = (name: string, email: string) => {
    const user = {
      name,
      email,
    };
    db.push(user);
    console.log("DB updated", user);
  };

  getAllUsers = () => {
    return db;
  };

  chat = (question: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      chatInstance
        .makeResponse(question)

        .then((response) => {
          // console.log("Service response: ", response);
          resolve(response);
        })

        .catch((error) => {
          reject(error);
        });
    });
  };
}
