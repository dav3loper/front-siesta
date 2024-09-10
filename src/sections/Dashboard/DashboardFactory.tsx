import React from "react";
import {Dashboard} from "./Dashboard";
import {FakeFilmFestivalRepository} from "../../infrastructure/Dashboard/FakeFilmFestivalRepository";
import {AsyncFetchVoteRepository} from "../../infrastructure/Dashboard/AsyncFetchVoteRepository";

const filmFestivalRepository = new FakeFilmFestivalRepository();
const voteRepository = new AsyncFetchVoteRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export class DashboardFactory {
    static create(): React.ReactElement {
        return <Dashboard filmFestivalRepository={filmFestivalRepository} voteRepository={voteRepository} />;
    }
}