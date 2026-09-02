import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Movie} from "../../domain/Movie/Movie";
import useToken from "../Login/UseToken";
import {VoteRepository} from "../../domain/Vote/VoteRepository";
import {VoteData} from "../../domain/Vote/VoteData";
import styles from './FilmFestivalVoteList.module.scss';

function sortVotes(vote1: VoteData, vote2:VoteData){
    const order = ['d', 'D', 's', 'S', 'u', 'U', 'l', 'L', 'm', 'M'];
    const index1 = order.findIndex((element) => element === vote1.user_name)
    const index2 = order.findIndex((element) => element === vote2.user_name)
    return index1 - index2;
}

export function FilmFestivalVoteList({movieRepository, voteRepository}: {
    movieRepository: MovieRepository,
    voteRepository: VoteRepository
}) {
    const filmFestivalId = useParams() as { id: string };
    const {token} = useToken();
    const userToken = token!;
    const [movieList, setMovieList] = useState<Movie[]>([]);
    useEffect(() => {
        movieRepository.findAll(filmFestivalId.id, userToken.token)
            .then(movieList => {
                setMovieList(movieList)
            })
            .catch(error => console.error(error));

    }, []);

    return <section className={styles.page}>
        <h2 className={styles.heading}>Registro de expedientes</h2>
        {movieList.map((movieWithVote) => (
            <article className={styles.row} key={movieWithVote.id}>
                <span className={styles.code}>EXP-{String(movieWithVote.id).padStart(2, '0')}</span>
                {movieWithVote.link
                    ? <a className={styles.title} href={movieWithVote.link}>{movieWithVote.title}</a>
                    : <span className={styles.title}>{movieWithVote.title}</span>}
                {movieWithVote.alias && <span className={styles.alias}>{movieWithVote.alias}</span>}
                <div className={styles.votes}>
                    {movieWithVote.votes.sort(sortVotes).map((vote: VoteData) => (
                        <span key={vote.user_id} className={styles.chip} data-score={vote.score}
                              title={`${vote.user_name}`}>
                            {vote.user_name[0]?.toUpperCase()}
                        </span>
                    ))}
                </div>
            </article>
        ))
        }
    </section>;
}