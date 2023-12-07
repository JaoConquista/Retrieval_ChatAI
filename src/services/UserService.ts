const db = [
    {
        name: "João",
        email: "joao@gmail.com"
    },
    {
        name: "Maria",
        email: "maria@gmail.com"
    }
    
]

export class UserService{
    createUser = (name: string, email: string) => {
        const user = {
            name,
            email
        }
        db.push(user)
        console.log("DB updated", user)
    }

    getAllUsers = () => {return db}
    
}