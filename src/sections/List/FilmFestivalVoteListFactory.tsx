import {FakeMovieRepository} from "../../infrastructure/Movie/FakeMovieRepository";
import React from "react";
import {FilmFestivalVoteList} from "./FilmFestivalVoteList";
import {AsyncFetchVoteRepository} from "../../infrastructure/Dashboard/AsyncFetchVoteRepository";

const movieRepository = new FakeMovieRepository();
const voteRepository = new AsyncFetchVoteRepository(process.env.REACT_APP_API_BASE_URL ?? '');


export class FilmFestivalVoteListFactory {
    static create(): React.ReactElement {
        return <FilmFestivalVoteList movieRepository={movieRepository} voteRepository={voteRepository}/>;
    }
}