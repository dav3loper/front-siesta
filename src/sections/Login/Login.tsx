import React, {useState} from "react";
import {UserRepository} from "../../domain/User/UserRepository";

export function Login({userRepository, setToken}: {userRepository: UserRepository, setToken:any}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await userRepository.login({
            email,
            password
        });
        setToken(token);
    }

    return <div className="login-wrapper">
        <h1>Hay que logarse gipi!</h1>
        <form onSubmit={handleSubmit}>
            <label>
                <p>Email</p>
                <input type="text" onChange={e => setEmail(e.target.value)}/>
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)}/>
            </label>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
        ;
}