import {Movie} from "./Movie";
import {MovieMaterial} from "./MovieMaterial";

export interface MovieRepository {
    findById(id: number, token: string): Promise<Movie>
    findAll(filmFestivalId: string, token: string): Promise<Movie[]>
    discardMaterial(id: number, material: MovieMaterial, token: string): Promise<Movie>
}
