import {LoginData} from "../../domain/User/LoginData";
import {User} from "../../domain/User/User";
import {UserRepository} from "../../domain/User/UserRepository";

export class AsyncFetchUserRepository implements UserRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    login(loginData: LoginData): Promise<User> {
        return fetch(this.host+'/login', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
            .then(data => data.json())
            .catch(error => console.error(error));
    }

}