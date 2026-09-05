import {useEffect, useState} from "react";
import {FilmFestival} from "../../domain/Dashboard/FilmFestival";
import {VoteRepository} from "../../domain/Dashboard/VoteRepository";
import {Movie} from "../../domain/Dashboard/Movie";
import styles from "./Dashboard.module.scss";
import {posterForFestival} from "../../assets/imgs/poster/posterByFestivalId";

export function FilmFestivalCard({filmFestival, voteRepository, token}: {
    filmFestival: FilmFestival,
    voteRepository: VoteRepository,
    token: string
}) {
    const [nextMovie, setNextMovie] = useState<Movie>();
    const [pendingVotes, setPendingVotes] = useState<number>();
    const [error, setError] = useState('');

    useEffect(() => {
        voteRepository.findNextByUserIdAndFilmFestival(filmFestival.id, token)
            .then((movie) => setNextMovie(movie))
            .catch((err) => setError(err.message))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        voteRepository.countPendingVotes(filmFestival.id, token)
            .then((count) => setPendingVotes(count))
            .catch((err) => setError(err.message))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDate = (date: Date) => date.toLocaleDateString('es-ES', {day: 'numeric', month: 'short'});

    return (
        <article className={styles.file}>
            <div className={styles.posterWrap}>
                <img alt={filmFestival.name} src={posterForFestival(filmFestival.id)} className={styles.poster}/>
                <div className={styles.scan}/>
            </div>
            <div className={styles.stub}>
                <p className={styles.eyebrow}>Expediente · Festival</p>
                <h2 className={styles.title}>{filmFestival.name}</h2>
                <p className={styles.meta}>
                    {filmFestival.edition}ª edición · {formatDate(filmFestival.startsAt)}–{formatDate(filmFestival.endsAt)}
                </p>
                {pendingVotes !== undefined && (
                    pendingVotes > 0
                        ? <p className={styles.stamp}>Pendientes · {pendingVotes}</p>
                        : <p className={`${styles.stamp} ${styles["stamp--clear"]}`}>Al día</p>
                )}
                <div className={styles.actions}>
                    {pendingVotes === 0
                        ? <a className={`${styles.cta} ${styles["cta--primary"]}`}
                             href={`/film-festival/${filmFestival.id}/cleared`}>&gt; Ver estado</a>
                        : <a className={`${styles.cta} ${styles["cta--primary"]}`}
                             href={`/movie/${nextMovie?.id}`}>&gt; Votar</a>}
                    <a className={`${styles.cta} ${styles["cta--ghost"]}`} href={`/film-festival/${filmFestival.id}/list`}>&gt; Ver listado</a>
                    <a className={`${styles.cta} ${styles["cta--ghost"]}`} href={`/film-festival/${filmFestival.id}/ratings`}>&gt; Calificar</a>
                </div>
                {error ? <p className={styles.error}>{error}</p> : null}
            </div>
        </article>
    );
}
