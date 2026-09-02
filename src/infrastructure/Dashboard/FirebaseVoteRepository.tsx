import {VoteRepository} from "../../domain/Dashboard/VoteRepository";
import {Movie} from "../../domain/Dashboard/Movie";
import {findNextUnvotedMovie} from "../Vote/nextUnvotedMovie";

export class FirebaseVoteRepository implements VoteRepository {
    findNextByUserIdAndFilmFestival(filmFestivalId: string, token: string): Promise<Movie> {
        return findNextUnvotedMovie(filmFestivalId);
    }
}
