import React, {useState} from "react";
import {LoginRepository} from "../../domain/Login/LoginRepository";
import styles from "./Login.module.scss";
import brand from "../Layout/brand.png";

export function Login({userRepository, setToken}: { userRepository: LoginRepository, setToken: any }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]=useState('');


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = await userRepository.login({
                email,
                password
            });
            setToken(token);
        }catch (error){
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return <div className={styles.screen}>
        <div className={styles.terminal}>
            <div className={styles.bar}>
                <span>Sitges // Terminal de acceso</span>
                <span className={styles.barLed}/>
            </div>
            <div className={styles.body}>
                <img src={brand} alt="Siesta" className={styles.brand}/>
                <h1 className={styles.title}>Esto es zona privada!</h1>
                <p className={styles.subtitle}>Identifícate para interceptar la señal</p>
                <form onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span className={styles.field__label}>Email</span>
                        <input
                            type="text"
                            name="username"
                            className={styles.field__input}
                            placeholder="tu@email.com"
                            onChange={e => setEmail(e.target.value)}/>
                    </label>
                    <label className={styles.field}>
                        <span className={styles.field__label}>Clave</span>
                        <input
                            type="password"
                            name="password"
                            className={styles.field__input}
                            placeholder="••••••••"
                            onChange={e => setPassword(e.target.value)}/>
                    </label>
                    <input type="submit" value="Conectar" className={styles.btn}/>
                </form>
                {error ? <div className={styles.error}>{error}</div> : null}
            </div>
        </div>
    </div>;
}