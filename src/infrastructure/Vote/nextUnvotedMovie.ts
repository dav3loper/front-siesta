import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "../firebaseApp";

export async function currentUserGroupId(): Promise<string> {
    const uid = auth.currentUser?.uid;
    if (!uid) {
        throw new Error('No hay sesión activa');
    }
    const profileSnapshot = await getDoc(doc(db, 'users', uid));
    return (profileSnapshot.data() as { groupId: string }).groupId;
}

export async function findNextUnvotedMovie(filmFestivalId: string): Promise<{ id: number }> {
    const groupId = await currentUserGroupId();

    const moviesSnapshot = await getDocs(query(collection(db, 'movies'), where('film_festival_id', '==', filmFestivalId)));
    const movieIds = moviesSnapshot.docs.map((movieDoc) => Number(movieDoc.id)).sort((a, b) => a - b);

    const votesSnapshot = await getDocs(query(collection(db, 'votes'), where('film_festival_id', '==', filmFestivalId)));
    const votedMovieIds = new Set(
        votesSnapshot.docs
            .map((voteDoc) => voteDoc.data() as { movie_id: string; group_id: string })
            .filter((vote) => vote.group_id === groupId)
            .map((vote) => Number(vote.movie_id))
    );

    const nextMovieId = movieIds.find((movieId) => !votedMovieIds.has(movieId));
    return {id: nextMovieId ?? movieIds[movieIds.length - 1]};
}
