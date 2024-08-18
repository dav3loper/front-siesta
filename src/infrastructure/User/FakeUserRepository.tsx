import { LoginData } from "../../domain/User/LoginData";
import {UserRepository} from "../../domain/User/UserRepository";
import {User} from "../../domain/User/User";

export class FakeUserRepository implements UserRepository {
    login(loginData: LoginData): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    token: "123456",
                });
            }, 500);
        });
    }

}