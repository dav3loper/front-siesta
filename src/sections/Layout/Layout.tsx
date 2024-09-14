import { Outlet } from "react-router-dom";

import brand from "./brand.png";
import styles from "./Layout.module.scss";

export function Layout() {
    return (
        <>
            <header className={styles.header}>
                <section className={styles.header__container}>
                    <a href={"/"}><img src={brand} alt="brand" className={styles.header__brand}/></a>
                </section>
            </header>
            <Outlet />
        </>
    );
}
