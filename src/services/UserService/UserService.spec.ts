import { User } from "../../interface/User.interface";
import { UserService } from "./UserService";

describe('UserService', () => {
    const mockDb: User[] = []
    const userService = new UserService(mockDb);
    
    it('Deve adicionar um novo usuário no banco de dados de teste', () => {
        const mockConsole = jest.spyOn(global.console, 'log');
        userService.createUser('Teste1','teste1@gmail.com');
        expect(mockConsole).toHaveBeenCalledWith("DB updated", mockDb);
    })

    it('Deve retornar todos os usuários do banco de dados de teste', () => {
        const users = userService.getAllUsers();
        expect(users).toEqual(mockDb);
        console.log(users)
    })
})