import React, {useState} from "react";
import {UserRepository} from "../../domain/User/UserRepository";
import styles from "./Login.module.scss";

export function Login({userRepository, setToken}: { userRepository: UserRepository, setToken: any }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await userRepository.login({
            email,
            password
        });
        setToken(token);
    }

    return <div className={styles.login}>
        <h1>Esto es zona privada!</h1>
        <form onSubmit={handleSubmit}>
            <div className={styles.text_area}>
                <input
                    type="text"
                    name="username"
                    className={styles.text_input}
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className={styles.text_area}>
                <input
                    type="password"
                    name="password"
                    className={styles.text_input}
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)}/>
            </div>
            <div>
                <input type="submit" value="Login" className={styles.btn} />
            </div>
        </form>
    </div>
        ;
}