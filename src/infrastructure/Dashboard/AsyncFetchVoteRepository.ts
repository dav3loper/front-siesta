import {VoteRepository} from "../../domain/Dashboard/VoteRepository";
import {Movie} from "../../domain/Dashboard/Movie";

export class AsyncFetchVoteRepository implements VoteRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    findNextByUserIdAndFilmFestival(filmFestivalId: string, token: string): Promise<Movie> {
        return fetch(this.host+`/film-festival/${filmFestivalId}/next`, {
            mode: 'cors',
            method: 'GET',
            headers : {
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

}