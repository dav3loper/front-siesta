import {Group} from "../../domain/User/Group";
import {UserRepository} from "../../domain/User/UserRepository";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebaseApp";

export class FirebaseUserRepository implements UserRepository {
    async usersFromGroup(groupId: number, token: string): Promise<Group> {
        const snapshot = await getDoc(doc(db, 'groups', String(groupId)));
        if (!snapshot.exists()) {
            throw new Error('Grupo no encontrado');
        }
        return {id: groupId, ...(snapshot.data() as Omit<Group, 'id'>)};
    }
}
