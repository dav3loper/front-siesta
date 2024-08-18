import { Movie } from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";

export class FakeMovieRepository implements MovieRepository {
    findById(id: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    id: 2,
                    title: "La pelicula de prueba",
                    duration: 120,
                    poster: "https://www.vintagemovieposters.co.uk/wp-content/uploads/2023/03/IMG_1887-scaled.jpeg",
                    trailer: "2Z4m4lnjxkY",
                    summary: "Es una pelicula que va de pruebas en pruebas",
                    comments: "",
                    link: "https://sitgesfilmfestival.com/es/film/2023/100-anos-walt-disney-animation-studios-homenaje-cortos",
                    alias: "Test",
                });
            }, 2000);
        });
    }

}