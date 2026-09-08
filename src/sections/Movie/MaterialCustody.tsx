import {useState} from "react";
import {Movie} from "../../domain/Movie/Movie";
import {MovieMaterial} from "../../domain/Movie/MovieMaterial";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import styles from "./MaterialCustody.module.scss";

type CustodyStatus = 'idle' | 'armed' | 'sending' | 'discarded' | 'failed';

function report(status: CustodyStatus, present: boolean): { text: string, tone: string } {
    switch (status) {
        case 'armed':
            return {text: '¿Descartar del expediente?', tone: 'armed'};
        case 'sending':
            return {text: 'Descartando…', tone: 'pending'};
        case 'discarded':
            return {text: 'Descartado · pendiente de recaptura', tone: 'pending'};
        case 'failed':
            return {text: 'La orden no llegó al archivo. Inténtalo de nuevo.', tone: 'failed'};
        default:
            return present ? {text: 'En expediente', tone: 'live'} : {text: 'Sin material', tone: 'none'};
    }
}

export function MaterialCustody({movieId, poster, trailer, repository, token, onDiscarded}: {
    movieId: number,
    poster: string,
    trailer: string,
    repository: MovieRepository,
    token: string,
    onDiscarded: (movie: Movie) => void
}) {
    const [custody, setCustody] = useState<Record<MovieMaterial, CustodyStatus>>({poster: 'idle', trailer: 'idle'});

    const setStatus = (material: MovieMaterial, status: CustodyStatus) =>
        setCustody((current) => ({...current, [material]: status}));

    const discard = async (material: MovieMaterial) => {
        setStatus(material, 'sending');
        try {
            const updatedMovie = await repository.discardMaterial(movieId, material, token);
            setStatus(material, 'discarded');
            onDiscarded(updatedMovie);
        } catch (error) {
            setStatus(material, 'failed');
        }
    };

    const materials: { key: MovieMaterial, label: string, present: boolean }[] = [
        {key: 'poster', label: 'Cartel', present: Boolean(poster)},
        {key: 'trailer', label: 'Señal de vídeo', present: Boolean(trailer)}
    ];

    return <section className={styles.custody}>
        <p className={styles.eyebrow}>{'// Cadena de custodia'}</p>
        <p className={styles.hint}>Descarta el material que no corresponde a esta película.</p>
        {materials.map(({key, label, present}) => {
            const status = custody[key];
            const {text, tone} = report(status, present);
            const actionable = present && (status === 'idle' || status === 'failed');
            return <div key={key}
                        className={`${styles.row} ${status === 'armed' ? styles['row--armed'] : ''}`}>
                <span className={styles.name}>
                    <span className={`${styles.led} ${styles[`led--${tone}`]}`} aria-hidden="true"/>
                    {label}
                </span>
                <span className={`${styles.status} ${styles[`status--${tone}`]}`} aria-live="polite">{text}</span>
                <span className={styles.actions}>
                    {actionable &&
                        <button type="button" className={styles.action} onClick={() => setStatus(key, 'armed')}>
                            Descartar
                        </button>}
                    {(status === 'armed' || status === 'sending') && <>
                        <button type="button" className={styles.action} disabled={status === 'sending'}
                                onClick={() => setStatus(key, 'idle')}>
                            Cancelar
                        </button>
                        <button type="button" className={`${styles.action} ${styles.confirm}`}
                                disabled={status === 'sending'} onClick={() => discard(key)}>
                            Descartar
                        </button>
                    </>}
                </span>
            </div>;
        })}
    </section>;
}
