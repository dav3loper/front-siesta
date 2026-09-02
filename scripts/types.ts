import {Movie} from '../src/domain/Movie/Movie';

export type DraftMovie = Omit<Movie, 'id' | 'votes'> & {
    id?: number;
    _tmdbId?: number;
    _tmdbMatchTitle?: string;
};
