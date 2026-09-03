import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";
import React, {useEffect, useState} from "react";
import {FilmFestival} from "../../domain/Dashboard/FilmFestival";
import styles from "./Dashboard.module.scss";
import {VoteRepository} from "../../domain/Dashboard/VoteRepository";
import useToken from "../Login/UseToken";
import {FilmFestivalCard} from "./FilmFestivalCard";

export function Dashboard({filmFestivalRepository, voteRepository}: {
    filmFestivalRepository: FilmFestivalRepository,
    voteRepository: VoteRepository
}) {
    const [filmFestivalData, setFilmFestivalData] = useState<FilmFestival[]>([]);
    const {token} = useToken();
    const [error, setError] = useState('');

    useEffect(() => {
        filmFestivalRepository.findAll(token.token)
            .then((filmFestivalData) => setFilmFestivalData(filmFestivalData))
            .catch((err) => setError(err.message))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className={styles.page}>
            {filmFestivalData.map((filmFestival) => (
                <FilmFestivalCard key={filmFestival.id} filmFestival={filmFestival}
                                   voteRepository={voteRepository} token={token.token}/>
            ))}
            {error ? <p className={styles.error}>{error}</p> : null}
        </section>
    );
}
