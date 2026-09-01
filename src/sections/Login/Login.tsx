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

    return <div>
        <header className={styles.header}>
            <section className={styles.header__container}>
                <img src={brand} alt="Siesta" className={styles.header__brand}/>
            </section>
        </header>
        <div className={styles.perforation}/>
        <div className={styles.component}>
            <div className={styles.pass}>
                <div className={styles.pass__band}>Pase de jurado</div>
                <div className={styles.pass__body}>
                    <p className={styles.pass__eyebrow}>Acceso restringido</p>
                    <h1 className={styles.pass__title}>Esto es zona privada!</h1>
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
                            <span className={styles.field__label}>Contraseña</span>
                            <input
                                type="password"
                                name="password"
                                className={styles.field__input}
                                placeholder="••••••••"
                                onChange={e => setPassword(e.target.value)}/>
                        </label>
                        <input type="submit" value="Entrar" className={styles.btn}/>
                    </form>
                    {error ? <div className={styles.error}>{error}</div> : null}
                </div>
            </div>
        </div>
    </div>;
}