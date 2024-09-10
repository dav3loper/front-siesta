import {Movie} from "./Movie";

export interface VoteRepository {
    findNextByUserIdAndFilmFestival(filmFestivalId: string, token: string): Promise<Movie>;
}