import {VoteData} from "./VoteData";
import {Movie} from "../Dashboard/Movie";

export interface VoteRepository {
    vote(id: string, loginData: VoteData[], token: string): Promise<any>
    findNextByUserIdAndFilmFestival(filmFestivalId: string, token: string): Promise<Movie>;
}