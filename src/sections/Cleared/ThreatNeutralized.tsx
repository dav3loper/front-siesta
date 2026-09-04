import styles from "./ThreatNeutralized.module.scss";

export function ThreatNeutralized() {
    return (
        <section className={styles.page}>
            <div className={styles.panel}>
                <p className={styles.eyebrow}>{'// Estado del sector'}</p>
                <div className={styles.radar}>
                    <div className={styles.radarSweep}/>
                    <div className={styles.radarCore}/>
                </div>
                <h1 className={styles.title}>Amenaza neutralizada</h1>
                <p className={styles.body}>
                    Expediente cerrado. Todas las amenazas de esta edición han sido clasificadas
                    — no queda ninguna pendiente de revisión.
                </p>
                <a className={styles.cta} href="/">&gt; Volver al panel</a>
            </div>
        </section>
    );
}
