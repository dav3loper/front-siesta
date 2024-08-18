import React from "react";
import {Login} from "./Login";
import {FakeUserRepository} from "../../infrastructure/User/FakeUserRepository";
import useToken from "./UseToken";

const userRepository = new FakeUserRepository();

export function LoginFactory(setToken: any): React.ReactElement {

    return <Login userRepository={userRepository} setToken={setToken}/>;
}