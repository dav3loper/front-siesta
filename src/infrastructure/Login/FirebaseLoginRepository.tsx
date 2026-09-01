import {LoginData} from "../../domain/Login/LoginData";
import {User} from "../../domain/Login/User";
import {LoginRepository} from "../../domain/Login/LoginRepository";
import {signInWithEmailAndPassword} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../firebaseApp";

export class FirebaseLoginRepository implements LoginRepository {
    async login(loginData: LoginData): Promise<User> {
        let credential;
        try {
            credential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
        } catch (error) {
            throw new Error('Usuario o contraseña no válido');
        }

        const profileSnapshot = await getDoc(doc(db, 'users', credential.user.uid));
        if (!profileSnapshot.exists()) {
            throw new Error('Tu cuenta no tiene un perfil asociado, contacta con el administrador');
        }
        const profile = profileSnapshot.data() as { userName: string; groupId: string; groupName: string };

        return {
            token: await credential.user.getIdToken(),
            userId: credential.user.uid,
            userName: profile.userName,
            groupId: profile.groupId,
            groupName: profile.groupName
        };
    }
}
