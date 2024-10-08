import {LoginData} from "../../domain/Login/LoginData";
import {User} from "../../domain/Login/User";
import {LoginRepository} from "../../domain/Login/LoginRepository";

export class AsyncFetchLoginRepository implements LoginRepository {
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
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Usuario o contraseña no valido');
        });
    }

}