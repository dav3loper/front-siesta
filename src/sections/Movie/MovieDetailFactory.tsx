import React from "react";
import {MovieDetail} from "./MovieDetail";
import {FirebaseUserRepository} from "../../infrastructure/User/FirebaseUserRepository";
import {FirebaseVoteRepository} from "../../infrastructure/Vote/FirebaseVoteRepository";
import {FirebaseMovieRepository} from "../../infrastructure/Movie/FirebaseMovieRepository";

const repository = new FirebaseMovieRepository();
const userRepository = new FirebaseUserRepository();
const voteRepository = new FirebaseVoteRepository();

export class MovieDetailFactory {
    static create(): React.ReactElement {
        return <MovieDetail repository={repository} userRepository={userRepository} voteRepository={voteRepository}/>;
    }
}
