import React from "react";
import {Login} from "./Login";
import {FirebaseLoginRepository} from "../../infrastructure/Login/FirebaseLoginRepository";

const userRepository = new FirebaseLoginRepository();

export function LoginFactory(setToken: any): React.ReactElement {

    return <Login userRepository={userRepository} setToken={setToken}/>;
}
