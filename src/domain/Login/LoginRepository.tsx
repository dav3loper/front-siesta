import {LoginData} from "./LoginData";
import {User} from "./User";


export interface LoginRepository {
    login(loginData: LoginData): Promise<User>
}