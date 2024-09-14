import React from "react";
import {MovieDetail} from "./MovieDetail";
import {AsyncFetchUserRepository} from "../../infrastructure/User/AsyncFetchUserRepository";
import {AsyncFetchVoteRepository} from "../../infrastructure/Vote/AsyncFetchVoteRepository";
import {AsyncFetchMovieRepository} from "../../infrastructure/Movie/AsyncFetchMovieRepository";

const repository = new AsyncFetchMovieRepository(process.env.REACT_APP_API_BASE_URL ?? '');
const userRepository = new AsyncFetchUserRepository(process.env.REACT_APP_API_BASE_URL ?? '');
const voteRepository = new AsyncFetchVoteRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export class MovieDetailFactory {
    static create(): React.ReactElement {
        return <MovieDetail repository={repository} userRepository={userRepository} voteRepository={voteRepository}/>;
    }
}