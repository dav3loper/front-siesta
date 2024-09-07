import React from "react";
import {Login} from "./Login";
import {AsyncFetchLoginRepository} from "../../infrastructure/Login/AsyncFetchLoginRepository";

const userRepository = new AsyncFetchLoginRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export function LoginFactory(setToken: any): React.ReactElement {

    return <Login userRepository={userRepository} setToken={setToken}/>;
}