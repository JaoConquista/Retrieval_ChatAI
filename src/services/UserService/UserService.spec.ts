import { User } from "../../interface/User.interface";
import { UserService } from "./UserService";

describe('UserService', () => {
    const mockDb: User[] = []
    const userService = new UserService(mockDb);
    
    it('Should add a new user in the DB', () => {
        const mockConsole = jest.spyOn(global.console, 'log');
        userService.createUser('Teste1','teste1@gmail.com');
        expect(mockConsole).toHaveBeenCalledWith("DB updated", mockDb);
    })

    it('Should return the users os DB', () => {
        const users = userService.getAllUsers();
        expect(users).toEqual(mockDb);
        console.log(users)
    })
})