import {FilmFestival} from "../../domain/Dashboard/FilmFestival";
import {FilmFestivalRepository} from "../../domain/Dashboard/FilmFestivalRepository";
import {collection, doc, DocumentData, getDoc, getDocs, Timestamp} from "firebase/firestore";
import {db} from "../firebaseApp";

function toFilmFestival(id: string, data: DocumentData): FilmFestival {
    return {
        id,
        name: data.name,
        edition: data.edition,
        startsAt: (data.startsAt as Timestamp).toDate(),
        endsAt: (data.endsAt as Timestamp).toDate()
    };
}

export class FirebaseFilmFestivalRepository implements FilmFestivalRepository {
    async findAll(): Promise<FilmFestival[]> {
        const snapshot = await getDocs(collection(db, 'film_festivals'));
        return snapshot.docs.map((festivalDoc) => toFilmFestival(festivalDoc.id, festivalDoc.data()));
    }

    async findById(id: number): Promise<FilmFestival> {
        const snapshot = await getDoc(doc(db, 'film_festivals', String(id)));
        if (!snapshot.exists()) {
            throw new Error('Festival no encontrado');
        }
        return toFilmFestival(snapshot.id, snapshot.data());
    }
}
