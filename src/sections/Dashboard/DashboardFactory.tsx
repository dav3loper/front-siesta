import React from "react";
import {Dashboard} from "./Dashboard";
import {AsyncFetchFilmFestivalRepository} from "../../infrastructure/Dashboard/AsyncFetchFilmFestivalRepository";
import {AsyncFetchVoteRepository} from "../../infrastructure/Dashboard/AsyncFetchVoteRepository";

const filmFestivalRepository = new AsyncFetchFilmFestivalRepository(process.env.REACT_APP_API_BASE_URL ?? '');
const voteRepository = new AsyncFetchVoteRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export class DashboardFactory {
    static create(): React.ReactElement {
        return <Dashboard filmFestivalRepository={filmFestivalRepository} voteRepository={voteRepository} />;
    }
}