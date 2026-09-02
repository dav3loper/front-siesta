import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";
import React, {useEffect, useState} from "react";
import {FilmFestival} from "../../domain/Dashboard/FilmFestival";
import styles from "./Dashboard.module.scss";
//TODO: try to do dynamically
import lastEditionLogo from "../../assets/imgs/poster/58_Sitges.png"
import {VoteRepository} from "../../domain/Dashboard/VoteRepository";
import useToken from "../Login/UseToken";
import {Movie} from "../../domain/Dashboard/Movie";

export function Dashboard({filmFestivalRepository, voteRepository}: {
    filmFestivalRepository: FilmFestivalRepository,
    voteRepository: VoteRepository
}) {
    const [filmFestivalData, setFilmFestivalData] = useState<FilmFestival[]>([]);
    const {token} = useToken();
    const [error, setError] = useState('');
    //TODO: remove this
    const filmFestivalId = '8';

    useEffect(() => {
        filmFestivalRepository.findAll().then((filmFestivalData) => setFilmFestivalData(filmFestivalData))
    }, []);

    const [nextMovie, setNextMovie] = useState<Movie>();

    useEffect(() => {
        voteRepository.findNextByUserIdAndFilmFestival(filmFestivalId, token.token)
            .then((movie) => setNextMovie(movie))
            .catch((err) => setError(err.message))
    }, []);


    const formatDate = (date: Date) => date.toLocaleDateString('es-ES', {day: 'numeric', month: 'short'});

    return (
        <section className={styles.page}>
            {filmFestivalData.map((filmFestival) => (
                <article key={filmFestival.id} className={styles.file}>
                    <div className={styles.posterWrap}>
                        <img alt={filmFestival.name} src={lastEditionLogo} className={styles.poster}/>
                        <div className={styles.scan}/>
                    </div>
                    <div className={styles.stub}>
                        <p className={styles.eyebrow}>Expediente · Festival</p>
                        <h2 className={styles.title}>{filmFestival.name}</h2>
                        <p className={styles.meta}>
                            {filmFestival.edition}ª edición · {formatDate(filmFestival.startsAt)}–{formatDate(filmFestival.endsAt)}
                        </p>
                        <div className={styles.actions}>
                            <a className={`${styles.cta} ${styles["cta--primary"]}`} href={`/movie/${nextMovie?.id}`}>&gt; Votar</a>
                            <a className={`${styles.cta} ${styles["cta--ghost"]}`} href={`/film-festival/${filmFestival.id}/list`}>&gt; Ver listado</a>
                        </div>
                    </div>
                </article>
            ))}
            {error ? <p className={styles.error}>{error}</p> : null}
        </section>
    );
}