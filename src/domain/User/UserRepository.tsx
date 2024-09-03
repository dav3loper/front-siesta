import {LoginData} from "./LoginData";
import {User} from "./User";

export interface UserRepository {
    login(loginData: LoginData): Promise<User>
}