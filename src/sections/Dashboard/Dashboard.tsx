import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";
import React, {useEffect, useState} from "react";
import {FilmFestival} from "../../domain/Dashboard/FilmFestival";
import styles from "./Dashboard.module.scss";
//TODO: try to do dynamically
import lastEditionLogo from "../../assets/imgs/poster/55_Sitges.png"
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
    const filmFestivalId = '7';

    useEffect(() => {
        filmFestivalRepository.findAll().then((filmFestivalData) => setFilmFestivalData(filmFestivalData))
    }, []);

    const [nextMovie, setNextMovie] = useState<Movie>();

    useEffect(() => {
        voteRepository.findNextByUserIdAndFilmFestival(filmFestivalId, token.token)
            .then((movie) => setNextMovie(movie))
            .catch((err) => setError(err.message))
    }, []);


    return (
        <section className={styles.container}>
            {filmFestivalData.map((filmFestival) => (
                <article key={filmFestival.id} className={styles.film_festival}>
                    <img alt={filmFestival.name} src={lastEditionLogo} className={styles.film_festival__logo}/>
                    <a className={styles.btn} href={`/movie/${nextMovie?.id}`}> Votar </a>
                    <a className={styles.btn} href={`/film-festival/${filmFestival.id}/list`}>Ver listado</a>
                </article>
            ))}
            {error ? <p>{error}</p> : null}
        </section>
    );
}