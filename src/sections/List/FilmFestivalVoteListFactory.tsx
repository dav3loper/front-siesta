import React from "react";
import {FilmFestivalVoteList} from "./FilmFestivalVoteList";
import {AsyncFetchMovieRepository} from "../../infrastructure/Movie/AsyncFetchMovieRepository";
import {AsyncFetchVoteRepository} from "../../infrastructure/Vote/AsyncFetchVoteRepository";

const movieRepository = new AsyncFetchMovieRepository(process.env.REACT_APP_API_BASE_URL ?? '');
const voteRepository = new AsyncFetchVoteRepository(process.env.REACT_APP_API_BASE_URL ?? '');


export class FilmFestivalVoteListFactory {
    static create(): React.ReactElement {
        return <FilmFestivalVoteList movieRepository={movieRepository} voteRepository={voteRepository}/>;
    }
}