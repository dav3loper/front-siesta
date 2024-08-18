import React from "react";
import {Dashboard} from "./Dashboard";
import {FakeFilmFestivalRepository} from "../../infrastructure/Dashboard/FakeFilmFestivalRepository";
import {FakeVoteRepository} from "../../infrastructure/Dashboard/FakeVoteRepository";

const filmFestivalRepository = new FakeFilmFestivalRepository();
const voteRepository = new FakeVoteRepository();

export class DashboardFactory {
    static create(): React.ReactElement {
        return <Dashboard filmFestivalRepository={filmFestivalRepository} voteRepository={voteRepository} />;
    }
}