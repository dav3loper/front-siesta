import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";
import {useEffect, useState} from "react";
import {FilmFestival} from "../../domain/Dashboard/FilmFestival";
import styles from "./Dashboard.module.scss";
//TODO: try to do dynamically
import lastEditionLogo from "../../assets/imgs/poster/55_Sitges.png"
import {VoteRepository} from "../../domain/Dashboard/VoteRepository";
import {Vote} from "../../domain/Dashboard/Vote";

//TODO: extract from session
const userId = 11;

export function Dashboard({filmFestivalRepository, voteRepository}: {
    filmFestivalRepository: FilmFestivalRepository,
    voteRepository: VoteRepository
}) {
    const [filmFestivalData, setFilmFestivalData] = useState<FilmFestival[]>([]);

    useEffect(() => {
        filmFestivalRepository.findAll().then((filmFestivalData) => setFilmFestivalData(filmFestivalData))
    }, []);

    const [voteData, setVoteData] = useState<Vote>();

    useEffect(() => {
        voteRepository.findLastByUserId(userId).then((voteData) => setVoteData(voteData))
    }, []);

    const nextMovie = voteData !== undefined ? voteData?.movieId + 1 : 1;

    return (
        <section className={styles.container}>
            {filmFestivalData.map((filmFestival) => (
                <article className={styles.film_festival}>
                    <div>
                        Nombre: {filmFestival.name}
                    </div>
                    <img alt={filmFestival.name} src={lastEditionLogo} className={styles.film_festival__logo}/>
                    <a href={`/movie/${nextMovie}`}> Votar </a>
                    <a href={`/film-festival/${filmFestival.id}/list`}>Ver listado</a>
                </article>
            ))}
        </section>
    );
}