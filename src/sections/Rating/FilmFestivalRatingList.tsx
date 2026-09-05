import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RatingRepository} from "../../domain/Rating/RatingRepository";
import {MovieRating} from "../../domain/Rating/MovieRating";
import useToken from "../Login/UseToken";
import styles from './FilmFestivalRatingList.module.scss';

const SCORES = [1, 2, 3, 4, 5];

function normalize(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function pendingFirst(movie1: MovieRating, movie2: MovieRating) {
    return Number(movie1.user_rating !== null) - Number(movie2.user_rating !== null);
}

export function FilmFestivalRatingList({ratingRepository}: { ratingRepository: RatingRepository }) {
    const filmFestivalId = useParams() as { id: string };
    const {token} = useToken();
    const [movieList, setMovieList] = useState<MovieRating[]>([]);
    const [pendingIds, setPendingIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [savingMovieId, setSavingMovieId] = useState<number>();
    const [ratingError, setRatingError] = useState<{ movieId: number, message: string }>();

    useEffect(() => {
        ratingRepository.findAllByFilmFestival(filmFestivalId.id, token)
            .then((movies) => {
                setMovieList([...movies].sort(pendingFirst));
                setPendingIds(movies.filter((movie) => movie.user_rating === null).map((movie) => movie.id));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRate = async (movie: MovieRating, score: number) => {
        const previousList = movieList;
        setRatingError(undefined);
        setSavingMovieId(movie.id);
        setMovieList(previousList.map((current) => current.id === movie.id ? {...current, user_rating: score} : current));

        try {
            const summary = await ratingRepository.rate(movie.id, score, token);
            setMovieList((current) => current.map((row) => row.id === movie.id ? {...row, ...summary} : row));
        } catch (err) {
            setMovieList(previousList);
            setRatingError({movieId: movie.id, message: 'La nota no se ha guardado. Vuelve a marcarla.'});
        } finally {
            setSavingMovieId(undefined);
        }
    };

    const visibleMovies = movieList.filter((movie) => normalize(movie.title).includes(normalize(filter.trim())));
    const unrated = visibleMovies.filter((movie) => pendingIds.includes(movie.id));
    const rated = visibleMovies.filter((movie) => !pendingIds.includes(movie.id));

    const renderMovie = (movie: MovieRating) => (
        <article className={styles.row} key={movie.id}>
            <span className={styles.code}>EXP-{String(movie.id).padStart(2, '0')}</span>
            <span className={styles.identity}>
                <span className={styles.title}>{movie.title}</span>
                {movie.section && <span className={styles.section}>{movie.section}</span>}
            </span>
            <span className={styles.average}>
                {movie.ratings_count > 0
                    ? <>
                        <span className={styles.averageValue}>{movie.average_rating?.toFixed(1)}</span>
                        <span className={styles.averageMeta}>n={movie.ratings_count}</span>
                    </>
                    : <>
                        <span className={styles.averageEmpty}>—</span>
                        <span className={styles.averageMeta}>sin valorar</span>
                    </>}
            </span>
            <span className={styles.mine}>
                <fieldset className={styles.meter} data-score={movie.user_rating ?? 0}
                          disabled={savingMovieId === movie.id}>
                    <legend className={styles.legend}>Tu nota para {movie.title}</legend>
                    {SCORES.map((score) => (
                        <label key={score} className={styles.segment}
                               data-lit={movie.user_rating !== null && score <= movie.user_rating}>
                            <input type="radio" className={styles.segmentInput} name={`rating-${movie.id}`}
                                   checked={movie.user_rating === score}
                                   onChange={() => handleRate(movie, score)}
                                   aria-label={`Calificar con ${score}`}/>
                        </label>
                    ))}
                </fieldset>
                <span className={styles.mineLabel}>
                    {movie.user_rating === null ? 'tu nota' : `tu nota · ${movie.user_rating}`}
                </span>
            </span>
            {ratingError?.movieId === movie.id && <p className={styles.rowError}>{ratingError.message}</p>}
        </article>
    );

    return <section className={styles.page}>
        <h2 className={styles.heading}>Registro de calificaciones</h2>

        <div className={styles.toolbar}>
            <input
                className={styles.search}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filtrar por título…"
                aria-label="Filtrar por título"
            />
            <span className={styles.counter}>{visibleMovies.length} / {movieList.length} expedientes</span>
        </div>

        {loading && <p className={styles.notice}>{'// Recuperando expedientes…'}</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && visibleMovies.length === 0 && (
            <p className={styles.notice}>
                {movieList.length === 0 ? 'No hay expedientes en esta edición.' : `Sin coincidencias para «${filter.trim()}».`}
            </p>
        )}

        {unrated.length > 0 && (
            <>
                <p className={styles.groupLabel}>Sin calificar · {unrated.length}</p>
                {unrated.map(renderMovie)}
            </>
        )}

        {rated.length > 0 && (
            <>
                <p className={styles.groupLabel}>Calificadas · {rated.length}</p>
                {rated.map(renderMovie)}
            </>
        )}
    </section>;
}
