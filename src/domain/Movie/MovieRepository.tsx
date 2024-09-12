import {Movie} from "./Movie";

export interface MovieRepository {
    findById(id: number, token: string): Promise<Movie>
    findAll(filmFestivalId: string, token: string): Promise<Movie[]>
}