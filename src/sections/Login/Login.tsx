import React, {useState} from "react";
import {LoginRepository} from "../../domain/Login/LoginRepository";
import styles from "./Login.module.scss";
import brand from "../Layout/brand.png";

export function Login({userRepository, setToken}: { userRepository: LoginRepository, setToken: any }) {
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

    return <>
        <header className={styles.header}>
            <section className={styles.header__container}>
                <img src={brand} alt="brand" className={styles.header__brand}/>
            </section>
        </header>
        <div className={styles.login}>
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
                    <input type="submit" value="Login" className={styles.btn}/>
                </div>
            </form>
        </div>
        </>
        ;
        }