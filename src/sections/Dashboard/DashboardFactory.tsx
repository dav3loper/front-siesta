import React from "react";
import {Dashboard} from "./Dashboard";
import {FirebaseFilmFestivalRepository} from "../../infrastructure/Dashboard/FirebaseFilmFestivalRepository";
import {FirebaseVoteRepository} from "../../infrastructure/Dashboard/FirebaseVoteRepository";

const filmFestivalRepository = new FirebaseFilmFestivalRepository();
const voteRepository = new FirebaseVoteRepository();

export class DashboardFactory {
    static create(): React.ReactElement {
        return <Dashboard filmFestivalRepository={filmFestivalRepository} voteRepository={voteRepository} />;
    }
}
