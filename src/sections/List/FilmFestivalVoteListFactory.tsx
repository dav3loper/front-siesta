import React from "react";
import {FilmFestivalVoteList} from "./FilmFestivalVoteList";
import {FirebaseMovieRepository} from "../../infrastructure/Movie/FirebaseMovieRepository";
import {FirebaseVoteRepository} from "../../infrastructure/Vote/FirebaseVoteRepository";

const movieRepository = new FirebaseMovieRepository();
const voteRepository = new FirebaseVoteRepository();


export class FilmFestivalVoteListFactory {
    static create(): React.ReactElement {
        return <FilmFestivalVoteList movieRepository={movieRepository} voteRepository={voteRepository}/>;
    }
}
