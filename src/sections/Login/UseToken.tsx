import { useState } from 'react';
import {User} from "../../domain/Login/User";

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        if(tokenString == null || tokenString === 'undefined') {
            return '';
        }
        const userToken = JSON.parse(tokenString);
        return userToken?.token?.token
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: User) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token.token);
    };

    return {
        setToken: saveToken,
        token
    }
}
