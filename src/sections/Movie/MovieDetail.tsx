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
        <div className={styles.movieDetail__title}>{movieData.title}</div>
        <div className={styles.movieDetail__duration}>{movieData.duration}</div>
        <iframe title={movieData.title} className={styles.movieDetail__trailer}
                src={`https://www.youtube.com/embed/${movieData.trailer}?rel=0&amp;showinfo=0`} frameBorder="0"
                allow="autoplay; encrypted-media" allowFullScreen></iframe>
            <img id="poster" className={styles.movieDetail__poster} src={movieData.poster} alt={movieData.title} />
        {/*</div>*/}
        <div className={styles.movieDetail__summary}>{movieData.summary}</div>
        <Vote className={styles.movieDetail__vote}/>
    </section>
        ;
}