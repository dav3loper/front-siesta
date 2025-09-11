import { FilmFestival } from "../../domain/Dashboard/FilmFestival";
import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";

export class FakeFilmFestivalRepository implements FilmFestivalRepository {
    findAll(): Promise<FilmFestival[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                    name: "2025 Sitges Film Festival",
                    edition: 58,
                    startsAt: new Date("2025-10-09"),
                    endsAt: new Date("2025-10-19"),
                    id: "8"
                }]);
            }, 300);
        });
    }
    findById(id: number): Promise<FilmFestival> {
        throw new Error("Method not implemented.");
    }

}