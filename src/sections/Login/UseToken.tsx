import { useState } from 'react';
import {User} from "../../domain/User/User";

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        if(tokenString == null || tokenString === 'undefined') {
            return '';
        }
        const userToken = JSON.parse(tokenString);
        return userToken?.token
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: User) => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token
    }
}
