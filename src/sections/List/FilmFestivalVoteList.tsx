import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Movie} from "../../domain/Movie/Movie";
import useToken from "../Login/UseToken";
import {VoteRepository} from "../../domain/Vote/VoteRepository";
import {MovieWithScore} from "../../domain/Movie/MovieWithScore";

export function FilmFestivalVoteList({movieRepository, voteRepository}: {
    movieRepository: MovieRepository,
    voteRepository: VoteRepository
}) {
    const filmFestivalId = useParams() as { id: string };
    const {token} = useToken();
    const [movieList, setMovieList] = useState<Movie[]>([])
    const [movieListWithVotes, setMovieListWithVotes] = useState<MovieWithScore[]>([]);
    useEffect(() => {
        movieRepository.findAll(filmFestivalId.id, token.token)
            .then(movieList => {
                setMovieList(movieList)
            })
            .catch(error => console.error(error));

    }, []);

    useEffect(() => {
        if(!movieList || !Array.isArray(movieList)) {
            return;
        }
        const movieWithVotes: MovieWithScore[] = [];
        for(const movie of movieList){
            voteRepository.getVotesForMovie(String(movie.id), token.token).then((votes) => {
                if(votes.votes.length > 0){
                   const scores = votes.votes.reduce((total, vote) => total + vote.score, '');
                    movieWithVotes.push({...movie, "score": scores});
                }
            });
        }
        setMovieListWithVotes(movieWithVotes);
    }, [movieList]);

    return <>
        <h2>Listado de películas: </h2>
        {movieList.map((movieWithVote) => (
            <article key={movieWithVote.id}>
                <a href={movieWithVote.link}><span>{movieWithVote.title}</span></a>
                <span></span>
            </article>
        ))
        }
    </>;
}