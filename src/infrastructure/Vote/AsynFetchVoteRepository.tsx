import {VoteRepository} from "../../domain/Vote/VoteRepository";
import {VoteData} from "../../domain/Vote/VoteData";
import { Movie } from "../../domain/Dashboard/Movie";

export class AsynFetchVoteRepository implements VoteRepository {
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

    async vote(id: string, voteData: VoteData[], token: string): Promise<any> {
        return fetch(this.host + `/movie/${id}/vote`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(voteData)
        });

    }
}