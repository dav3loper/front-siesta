import {FilmFestival} from "./FilmFestival";

export interface FilmFestivalRepository{
    findAll(): Promise<FilmFestival[]>
    findById(id: number): Promise<FilmFestival>

}