import React from "react";
import {Dashboard} from "../Dashboard/Dashboard";
import {Login} from "./Login";
import {FakeUserRepository} from "../../infrastructure/User/FakeUserRepository";
import useToken from "./UseToken";

const userRepository = new FakeUserRepository();

export function LoginFactory(): React.ReactElement {
    const {setToken} = useToken();
    return <Login userRepository={userRepository} setToken={setToken}/>;
}