export interface RatingSummary {
    average_rating: number | null;
    ratings_count: number;
    user_rating: number | null;
}

export interface MovieRating extends RatingSummary {
    id: number;
    title: string;
    poster: string;
    section: string | null;
    film_festival_id: number;
}
