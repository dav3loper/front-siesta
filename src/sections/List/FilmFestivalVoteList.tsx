import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {VoteRepository} from "../../domain/Dashboard/VoteRepository";
import {useParams} from "react-router-dom";

export function FilmFestivalVoteList({movieRepository, voteRepository}: {
    movieRepository: MovieRepository,
    voteRepository: VoteRepository
}) {
    const filmFestivalId = useParams() as { id: string };
    return <p> aqui va el listado para el </p>;
}