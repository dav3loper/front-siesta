import {FakeMovieRepository} from "../../infrastructure/Movie/FakeMovieRepository";
import React from "react";
import {MovieDetail} from "./MovieDetail";

const repository = new FakeMovieRepository();

export class MovieDetailFactory {
    static create(): React.ReactElement {
        return <MovieDetail repository={repository} />;
    }
}