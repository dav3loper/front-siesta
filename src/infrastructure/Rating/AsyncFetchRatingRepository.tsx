import {RatingRepository} from "../../domain/Rating/RatingRepository";
import {MovieRating, RatingSummary} from "../../domain/Rating/MovieRating";

export class AsyncFetchRatingRepository implements RatingRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    findAllByFilmFestival(filmFestivalId: string, token: string): Promise<MovieRating[]> {
        return fetch(this.host + `/film-festival/${filmFestivalId}/ratings`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Algo ha ido mal');
            });
    }

    async rate(movieId: number, score: number, token: string): Promise<RatingSummary> {
        const response = await fetch(this.host + `/movie/${movieId}/rating`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({score})
        });

        if (!response.ok) {
            throw new Error('Algo ha ido mal');
        }

        return response.json();
    }

}
