import {VoteData} from "../Vote/VoteData";

export interface Movie {
    id: number;
    title: string;
    duration: number;
    poster: string;
    trailer: string;
    summary: string;
    comments: string;
    link: string;
    alias: string;
    film_festival_id: string;
    section: string;
    sessions: Session[];
    votes: VoteData[];
}

export interface Session {
    location: string;
    init_date: string;
    end_date: string;
}