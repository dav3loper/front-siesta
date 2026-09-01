import {Movie} from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {VoteData} from "../../domain/Vote/VoteData";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseApp";

export class FirebaseMovieRepository implements MovieRepository {
    async findById(id: number, token: string): Promise<Movie> {
        const snapshot = await getDoc(doc(db, 'movies', String(id)));
        if (!snapshot.exists()) {
            throw new Error('Película no encontrada');
        }
        const votes = await votesForMovie(String(id));
        return {id, votes, ...(snapshot.data() as Omit<Movie, 'id' | 'votes'>)};
    }

    async findAll(filmFestivalId: string, token: string): Promise<Movie[]> {
        const snapshot = await getDocs(query(collection(db, 'movies'), where('film_festival_id', '==', filmFestivalId)));
        const votesByMovie = await votesForFestival(filmFestivalId);
        return snapshot.docs.map((movieDoc) => ({
            id: Number(movieDoc.id),
            votes: votesByMovie.get(movieDoc.id) ?? [],
            ...(movieDoc.data() as Omit<Movie, 'id' | 'votes'>)
        }));
    }
}

async function votesForMovie(movieId: string): Promise<VoteData[]> {
    const snapshot = await getDocs(query(collection(db, 'votes'), where('movie_id', '==', movieId)));
    return snapshot.docs.map((voteDoc) => voteDoc.data() as VoteData);
}

async function votesForFestival(filmFestivalId: string): Promise<Map<string, VoteData[]>> {
    const snapshot = await getDocs(query(collection(db, 'votes'), where('film_festival_id', '==', filmFestivalId)));
    const votesByMovie = new Map<string, VoteData[]>();
    snapshot.docs.forEach((voteDoc) => {
        const vote = voteDoc.data() as VoteData & { movie_id: string };
        const existing = votesByMovie.get(vote.movie_id) ?? [];
        existing.push(vote);
        votesByMovie.set(vote.movie_id, existing);
    });
    return votesByMovie;
}
