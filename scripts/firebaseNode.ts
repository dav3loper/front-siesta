import 'dotenv/config';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const auth = getAuth(app);
export const db = getFirestore(app);

export async function ensureSignedIn(): Promise<void> {
    const email = process.env.SCRIPT_LOGIN_EMAIL;
    const password = process.env.SCRIPT_LOGIN_PASSWORD;
    if (!email || !password) {
        throw new Error('SCRIPT_LOGIN_EMAIL y SCRIPT_LOGIN_PASSWORD son obligatorios en .env');
    }
    await signInWithEmailAndPassword(auth, email, password);
}
