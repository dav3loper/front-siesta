import { Movie } from "../../domain/Movie/Movie";
import {MovieMaterial} from "../../domain/Movie/MovieMaterial";
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

    discardMaterial(id: number, material: MovieMaterial, token: string): Promise<Movie> {
        return fetch(this.host+`/movie/${id}/media`, {
            mode: 'cors',
            method: 'PATCH',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({[material]: null})
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Algo ha ido mal');
            });
    }

    updateAlias(id: number, alias: string | null, token: string): Promise<Movie> {
        return fetch(this.host+`/movie/${id}/alias`, {
            mode: 'cors',
            method: 'PATCH',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({alias: alias})
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Algo ha ido mal');
            });
    }
}
