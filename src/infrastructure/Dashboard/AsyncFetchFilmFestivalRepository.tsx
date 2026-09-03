import {FilmFestival} from "../../domain/Dashboard/FilmFestival";
import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";

type RawFilmFestival = {
    id: string;
    edition_number: number;
    name: string;
    start_date: string;
    end_date: string;
};

export class AsyncFetchFilmFestivalRepository implements FilmFestivalRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    findAll(token: string): Promise<FilmFestival[]> {
        return fetch(this.host + `/film-festival`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Algo ha ido mal');
        }).then((filmFestivals: RawFilmFestival[]) => filmFestivals
            .map((filmFestival) => ({
                id: filmFestival.id,
                name: filmFestival.name,
                edition: filmFestival.edition_number,
                startsAt: new Date(filmFestival.start_date),
                endsAt: new Date(filmFestival.end_date)
            }))
            .sort((a, b) => Number(b.id) - Number(a.id))
        );
    }

    findById(id: number): Promise<FilmFestival> {
        throw new Error("Method not implemented.");
    }

}
