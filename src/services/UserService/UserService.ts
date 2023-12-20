import { Chat } from "../Chat/chat";
import { User } from "../../interface/User.interface";
import { upload } from "../../config/multerConfig";
import multer from "multer";

const db = [
  {
    name: "João",
    email: "joao@gmail.com",
  },
];

export class UserService {
  db: User[];
  constructor(database = db) {
    this.db = database;
  }

  createUser = (name: string, email: string) => {
    const user = {
      name,
      email,
    };
    this.db.push(user);
    console.log("DB updated", this.db);
  };

  getAllUsers = () => {
    return this.db;
  };

  chat = (question: string): Promise<string> => {
    const chat = new Chat();
    return new Promise((resolve, reject) => {
      chat
        .makeResponse(question)

        .then((response) => {
          resolve(response);
        })

        .catch((error) => {
          reject(error);
        });
    });
  };

  uploadFile = (fieldName: string) => {
    try {
      return upload.single(fieldName);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
