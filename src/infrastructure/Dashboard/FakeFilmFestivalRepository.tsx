import { FilmFestival } from "../../domain/Dashboard/FilmFestival";
import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";

export class FakeFilmFestivalRepository implements FilmFestivalRepository {
    findAll(): Promise<FilmFestival[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                    name: "2024 Sitges Film Festival",
                    edition: 55,
                    startsAt: new Date("2024-10-03"),
                    endsAt: new Date("2024-10-13"),
                    id: "7"
                }]);
            }, 300);
        });
    }
    findById(id: number): Promise<FilmFestival> {
        throw new Error("Method not implemented.");
    }

}