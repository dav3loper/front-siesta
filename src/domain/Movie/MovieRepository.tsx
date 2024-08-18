import {Movie} from "./Movie";

export interface MovieRepository {
    findById(id: number): Promise<Movie>
}