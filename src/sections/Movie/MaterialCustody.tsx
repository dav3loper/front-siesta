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

function MaterialIcon({material, className}: { material: MovieMaterial, className: string }) {
    return <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"
                aria-hidden="true">
        <path d="M2.5 2.5H13.5V11L11 13.5H2.5Z" strokeLinejoin="round"/>
        {material === 'poster'
            ? <>
                <circle cx="6" cy="6" r="1.1"/>
                <path d="M4 10.5 6.8 7.8 10.5 11" strokeLinejoin="round"/>
            </>
            : <path d="M6.5 5.2 10.8 8 6.5 10.8Z" fill="currentColor" strokeLinejoin="round"/>}
    </svg>;
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
        {key: 'trailer', label: 'Señal', present: Boolean(trailer)}
    ];

    return <section className={styles.custody} aria-label="Cadena de custodia">
        {materials.map(({key, label, present}) => {
            const status = custody[key];
            const {text, tone} = report(status, present);
            const actionable = present && (status === 'idle' || status === 'failed');
            return <div key={key}
                        className={`${styles.row} ${status === 'armed' ? styles['row--armed'] : ''}`}>
                <span className={styles.name}>
                    <MaterialIcon material={key} className={`${styles.icon} ${styles[`icon--${tone}`]}`}/>
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
