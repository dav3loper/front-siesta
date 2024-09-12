import {FakeMovieRepository} from "../../infrastructure/Movie/FakeMovieRepository";
import React from "react";
import {MovieDetail} from "./MovieDetail";
import {AsyncFetchUserRepository} from "../../infrastructure/User/AsyncFetchUserRepository";
import {AsyncFetchVoteRepository} from "../../infrastructure/Vote/AsyncFetchVoteRepository";

const repository = new FakeMovieRepository();
const userRepository = new AsyncFetchUserRepository(process.env.REACT_APP_API_BASE_URL ?? '');
const voteRepository = new AsyncFetchVoteRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export class MovieDetailFactory {
    static create(): React.ReactElement {
        return <MovieDetail repository={repository} userRepository={userRepository} voteRepository={voteRepository}/>;
    }
}