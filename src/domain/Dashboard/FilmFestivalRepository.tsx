import {FilmFestival} from "./FilmFestival";

export interface FilmFestivalRepository{
    findAll(token: string): Promise<FilmFestival[]>
    findById(id: number): Promise<FilmFestival>

}