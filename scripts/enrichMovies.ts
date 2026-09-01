import * as fs from 'fs';
import * as path from 'path';
import {collection, getDocs} from 'firebase/firestore';
import {db, ensureSignedIn} from './firebaseNode';
import {searchMovie, getMovieDetails, posterUrl} from './tmdb';
import {findTrailerId} from './youtube';
import {DraftMovie} from './types';

function readTitles(filePath: string): string[] {
    return fs.readFileSync(filePath, 'utf-8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('#'));
}

async function nextMovieId(): Promise<number> {
    const snapshot = await getDocs(collection(db, 'movies'));
    const ids = snapshot.docs.map((movieDoc) => Number(movieDoc.id)).filter((id) => !Number.isNaN(id));
    return (ids.length > 0 ? Math.max(...ids) : 0) + 1;
}

async function enrichTitle(title: string, id: number, filmFestivalId: string): Promise<DraftMovie> {
    const base: DraftMovie = {
        id,
        title,
        duration: 0,
        poster: '',
        trailer: '',
        summary: '',
        comments: '',
        link: '',
        alias: '',
        film_festival_id: filmFestivalId,
        section: '',
        sessions: [],
    };

    const tmdbMatch = await searchMovie(title);
    if (!tmdbMatch) {
        console.warn(`  [TMDB] sin resultados para "${title}"`);
    } else {
        const details = await getMovieDetails(tmdbMatch.id);
        base.summary = details.overview;
        base.duration = details.runtime;
        base.poster = posterUrl(details.poster_path);
        base._tmdbId = tmdbMatch.id;
        base._tmdbMatchTitle = tmdbMatch.title;
    }

    const trailerId = await findTrailerId(title);
    if (!trailerId) {
        console.warn(`  [YouTube] sin tráiler para "${title}"`);
    } else {
        base.trailer = trailerId;
    }

    return base;
}

async function main() {
    const [titlesPath, filmFestivalId] = process.argv.slice(2);
    if (!titlesPath || !filmFestivalId) {
        console.error('Uso: npm run scripts:enrich-movies -- <fichero-titulos.txt> <film_festival_id>');
        process.exit(1);
    }

    await ensureSignedIn();

    const titles = readTitles(titlesPath);
    console.log(`Enriqueciendo ${titles.length} títulos para el festival "${filmFestivalId}"...`);

    let nextId = await nextMovieId();
    const drafts: DraftMovie[] = [];
    let missingCount = 0;

    for (const title of titles) {
        console.log(`- ${title}`);
        const draft = await enrichTitle(title, nextId, filmFestivalId);
        if (!draft._tmdbId || !draft.trailer) {
            missingCount++;
        }
        drafts.push(draft);
        nextId++;
    }

    const outputPath = path.join('scripts', 'data', `movies.draft.${filmFestivalId}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(drafts, null, 2));

    console.log(`\nBorrador escrito en ${outputPath}`);
    console.log(`${missingCount} de ${drafts.length} títulos necesitan revisión manual (sin match de TMDB y/o tráiler).`);
    console.log('Revisa y corrige el JSON antes de ejecutar scripts:import-movies.');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
