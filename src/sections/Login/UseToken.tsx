import { useState } from 'react';
import {User} from "../../domain/Login/User";

export default function useToken() {
    const getToken = (): User | undefined => {
        const tokenString = localStorage.getItem('token');
        if(tokenString == null || tokenString === 'undefined') {
            return undefined;
        }
        return JSON.parse(tokenString) as User;
    };

    const [token, setToken] = useState<User | undefined>(getToken());

    const saveToken = (userToken: User) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token
    }
}
