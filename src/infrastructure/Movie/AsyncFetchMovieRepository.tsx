import { Movie } from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";

export class AsyncFetchMovieRepository implements MovieRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    findAll(id: string, token: string): Promise<Movie[]> {
        return fetch(this.host+`/film-festival/${id}/movies`, {
            mode: 'cors',
            method: 'GET',
            headers : {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Algo ha ido mal');
        });
    }

    findById(id: number, token: string): Promise<Movie> {
        return fetch(this.host+`/movie/${id}`, {
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