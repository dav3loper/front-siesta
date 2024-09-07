import {useEffect, useState} from "react";
import {Movie} from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {useParams} from "react-router-dom";
import styles from "./MovieDetail.module.scss";
import {Vote} from "./Vote";
import {UserRepository} from "../../domain/User/UserRepository";
import {Group} from "../../domain/User/Group";
import useToken from "../Login/UseToken";
import {decodeToken} from "react-jwt";
import {TokenData} from "../Login/TokenData";

export function MovieDetail({repository, userRepository}: { repository: MovieRepository , userRepository:UserRepository}) {
    const id = useParams() as { id: string };

    //TODO: Move all token management to class
    const {token} = useToken();
    const tokenData = decodeToken(token.token) as TokenData;
    const [movieData, setMovieData] = useState<Movie>();
    const [groupData, setGroupData] = useState<Group>();

    useEffect(() => {
        repository.findById(Number(id)).then((movieData) => setMovieData(movieData))
    }, []);
    useEffect(() => {
        userRepository.usersFromGroup(Number(tokenData.group_id), token.token).then((groupData) => setGroupData(groupData))
    }, []);

    if (movieData === undefined || groupData === undefined) {
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
        <span>Votos del grupo {groupData?.name}</span>
        {
            groupData.user_list.map(user => (
                <Vote key={user.id} className={styles.movieDetail__vote} userName={user.name} userId={user.id}/>
            ))
        }

    </section>
        ;
}