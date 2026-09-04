import { Outlet } from "react-router-dom";

import brand from "./brand.png";
import styles from "./Layout.module.scss";
import {AgentWidgetFactory} from "../Agent/AgentWidgetFactory";
import {AgentContextProvider} from "../Agent/AgentContext";

export function Layout() {
    return (
        <AgentContextProvider>
            <div className={styles.shell}>
                <aside className={styles.rail}>
                    <a href={"/"}><img src={brand} alt="Siesta" className={styles.brand}/></a>
                    <span className={styles.status}><span className={styles.led}/>Señal en vivo</span>
                </aside>
                <main className={styles.main}>
                    <Outlet/>
                </main>
                {AgentWidgetFactory.create()}
            </div>
        </AgentContextProvider>
    );
}
