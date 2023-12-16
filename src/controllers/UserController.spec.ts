import { Request } from "express";
import { UserService } from "../services/UserService/UserService";
import { UserController } from "./UserController";
import { Params } from "express-serve-static-core";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { MockResponse, makeMockResponse } from "../__mocks__/mockResponse.mock";
import { User } from "../interface/User.interface";

describe("UserController", () => {
  let mockDb: User[] = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
  ];
  const mockUserService: Partial<UserService> = {
    createUser: jest.fn(),
    getAllUsers: jest.fn().mockReturnValue(mockDb),
  };
  const userController = new UserController(mockUserService as UserService);

  it("should add a new user", () => {
    const mockRequest = {
      body: {
        name: "Jão Teste",
        email: "jaoteste@gmail.com",
      },
    } as Request;

    const mockResponse = makeMockResponse();
    userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(201);
    expect(mockResponse.state.json).toEqual({
      message: "Arquivo enviado com sucesso !",
    });
  });

  it("should get all users", () => {
    const mockResponse = makeMockResponse();
    userController.getUser(mockResponse);
    expect(mockResponse.state.status).toEqual(201);
    expect(mockResponse.state.json).toEqual(mockDb);
  });
});
