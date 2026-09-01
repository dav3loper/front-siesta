import * as fs from 'fs';
import {doc, setDoc} from 'firebase/firestore';
import {db, ensureSignedIn} from './firebaseNode';
import {DraftMovie} from './types';

function validate(drafts: DraftMovie[]): string[] {
    const errors: string[] = [];
    drafts.forEach((draft, index) => {
        if (typeof draft.id !== 'number' || Number.isNaN(draft.id)) {
            errors.push(`Entrada ${index}: falta un "id" numérico`);
        }
        if (!draft.title) {
            errors.push(`Entrada ${index}: falta "title"`);
        }
        if (!draft.film_festival_id) {
            errors.push(`Entrada ${index}: falta "film_festival_id"`);
        }
    });
    return errors;
}

async function main() {
    const [draftPath] = process.argv.slice(2);
    if (!draftPath) {
        console.error('Uso: npm run scripts:import-movies -- <borrador.json>');
        process.exit(1);
    }

    const drafts: DraftMovie[] = JSON.parse(fs.readFileSync(draftPath, 'utf-8'));

    const errors = validate(drafts);
    if (errors.length > 0) {
        console.error('El borrador tiene errores, no se ha escrito nada en Firestore:');
        errors.forEach((error) => console.error(`  - ${error}`));
        process.exit(1);
    }

    await ensureSignedIn();

    for (const draft of drafts) {
        const {id, _tmdbId, _tmdbMatchTitle, ...movieData} = draft;
        await setDoc(doc(db, 'movies', String(id)), movieData);
        console.log(`Escrito movies/${id} (${draft.title})`);
    }

    console.log(`\n${drafts.length} películas importadas correctamente.`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
