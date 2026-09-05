import {MovieRating, RatingSummary} from "./MovieRating";

export interface RatingRepository {
    findAllByFilmFestival(filmFestivalId: string, token: string): Promise<MovieRating[]>;

    rate(movieId: number, score: number, token: string): Promise<RatingSummary>;
}
