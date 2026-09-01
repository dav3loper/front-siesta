const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TmdbSearchResult {
    id: number;
    title: string;
}

interface TmdbMovieDetails {
    overview: string;
    runtime: number;
    poster_path: string | null;
}

function apiKey(): string {
    const key = process.env.TMDB_API_KEY;
    if (!key) {
        throw new Error('TMDB_API_KEY es obligatorio en .env');
    }
    return key;
}

export async function searchMovie(title: string): Promise<TmdbSearchResult | null> {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey()}&language=es-ES&query=${encodeURIComponent(title)}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = data.results?.[0];
    return result ? {id: result.id, title: result.title} : null;
}

export async function getMovieDetails(tmdbId: number): Promise<TmdbMovieDetails> {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${apiKey()}&language=es-ES`;
    const response = await fetch(url);
    const data = await response.json();
    return {
        overview: data.overview ?? '',
        runtime: data.runtime ?? 0,
        poster_path: data.poster_path ?? null,
    };
}

export function posterUrl(posterPath: string | null): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '';
}
