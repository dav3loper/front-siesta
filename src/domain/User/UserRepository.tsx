import {LoginData} from "./LoginData";
import {User} from "./User";

export interface UserRepository {
    login(loginData: LoginData): Promise<User>
}

//TODO: mover a infra
/*async function loginUser(credentials: LoginData) {
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}*/