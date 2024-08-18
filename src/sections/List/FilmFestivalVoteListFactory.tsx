import {FakeMovieRepository} from "../../infrastructure/Movie/FakeMovieRepository";
import React from "react";
import {FakeVoteRepository} from "../../infrastructure/Dashboard/FakeVoteRepository";
import {FilmFestivalVoteList} from "./FilmFestivalVoteList";

const movieRepository = new FakeMovieRepository();
const voteRepository = new FakeVoteRepository();


export class FilmFestivalVoteListFactory {
    static create(): React.ReactElement {
        return <FilmFestivalVoteList movieRepository={movieRepository} voteRepository={voteRepository}/>;
    }
}