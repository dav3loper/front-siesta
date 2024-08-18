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
                    id: "fake-id"
                },{
                    name: "2023 Sitges Film Festival",
                    edition: 54,
                    startsAt: new Date("2023-10-06"),
                    endsAt: new Date("2023-10-16"),
                    id: "fake-id-2"
                }]);
            }, 1000);
        });
    }
    findById(id: number): Promise<FilmFestival> {
        throw new Error("Method not implemented.");
    }

}