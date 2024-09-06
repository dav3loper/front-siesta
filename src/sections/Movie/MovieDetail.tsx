import {useEffect, useState} from "react";
import {Movie} from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {useParams} from "react-router-dom";
import styles from "./MovieDetail.module.scss";
import {Vote} from "./Vote";

export function MovieDetail({repository}: { repository: MovieRepository }) {
    const id = useParams() as { id: string };

    const [movieData, setMovieData] = useState<Movie>();

    useEffect(() => {
        repository.findById(Number(id)).then((movieData) => setMovieData(movieData))
    }, []);
    if (movieData === undefined) {
        return <></>;
    }

    return <section className={styles.movieDetail}>
        <a className={styles.movieDetail__title} href={movieData.link} target="_blank" rel="noreferrer">
            <h2>{movieData.title} ({movieData.duration} mins)</h2>
        </a>
            <img id="poster" className={styles.movieDetail__poster} src={movieData.poster} alt={movieData.title}/>
            <iframe title={movieData.title} className={styles.movieDetail__trailer}
                    src={`https://www.youtube.com/embed/${movieData.trailer}?rel=0&amp;showinfo=0`} frameBorder="0"
                    allow="autoplay; encrypted-media" allowFullScreen></iframe>
        <div className={styles.break}></div>
        {/*</div>*/}
        <div className={styles.movieDetail__summary}>{movieData.summary}</div>
        <Vote className={styles.movieDetail__vote}/>
    </section>
        ;
}