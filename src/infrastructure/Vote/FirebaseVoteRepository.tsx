import {VoteRepository} from "../../domain/Vote/VoteRepository";
import {VoteData, VoteResponse} from "../../domain/Vote/VoteData";
import {Movie} from "../../domain/Dashboard/Movie";
import {collection, doc, getDoc, getDocs, query, where, writeBatch} from "firebase/firestore";
import {db} from "../firebaseApp";
import {currentUserGroupId, findNextUnvotedMovie} from "./nextUnvotedMovie";

export class FirebaseVoteRepository implements VoteRepository {
    async getVotesForMovie(id: string, token: string): Promise<VoteResponse> {
        const snapshot = await getDocs(query(collection(db, 'votes'), where('movie_id', '==', id)));
        return {votes: snapshot.docs.map((voteDoc) => voteDoc.data() as VoteData)};
    }

    findNextByUserIdAndFilmFestival(filmFestivalId: string, token: string): Promise<Movie> {
        return findNextUnvotedMovie(filmFestivalId);
    }

    async vote(id: string, voteData: VoteData[], token: string): Promise<any> {
        const groupId = await currentUserGroupId();
        const movieSnapshot = await getDoc(doc(db, 'movies', id));
        const filmFestivalId = (movieSnapshot.data() as { film_festival_id: string }).film_festival_id;

        const batch = writeBatch(db);
        voteData.forEach((vote) => {
            const voteDocId = `${filmFestivalId}_${id}_${vote.user_id}`;
            batch.set(doc(db, 'votes', voteDocId), {
                movie_id: id,
                film_festival_id: filmFestivalId,
                group_id: groupId,
                user_id: vote.user_id,
                user_name: vote.user_name,
                score: vote.score
            });
        });
        await batch.commit();

        return {ok: true};
    }
}
