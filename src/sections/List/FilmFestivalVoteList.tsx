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
    const [movieList, setMovieList] = useState<Movie[]>([]);
    useEffect(() => {
        movieRepository.findAll(filmFestivalId.id, token.token)
            .then(movieList => {
                setMovieList(movieList)
            })
            .catch(error => console.error(error));

    }, []);

    return <>
        <h2>Listado de películas: </h2>
        {movieList.map((movieWithVote) => (
            <article className={styles.movie__row} key={movieWithVote.id}>
                <a href={movieWithVote.link}><span>{movieWithVote.title}</span></a>
                <div>{movieWithVote.votes.sort(sortVotes).reduce((accumulated, vote: VoteData) => accumulated+vote.user_name, '')}</div>
            </article>
        ))
        }
    </>;
}