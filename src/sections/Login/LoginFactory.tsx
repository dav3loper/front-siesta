import React from "react";
import {Login} from "./Login";
import {AsyncFetchUserRepository} from "../../infrastructure/User/AsyncFetchUserRepository";

const userRepository = new AsyncFetchUserRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export function LoginFactory(setToken: any): React.ReactElement {

    return <Login userRepository={userRepository} setToken={setToken}/>;
}