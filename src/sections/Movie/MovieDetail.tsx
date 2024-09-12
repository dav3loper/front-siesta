import React, {useEffect, useState} from "react";
import {Movie} from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {useParams} from "react-router-dom";
import styles from "./MovieDetail.module.scss";
import {UserRepository} from "../../domain/User/UserRepository";
import {Group} from "../../domain/User/Group";
import useToken from "../Login/UseToken";
import {decodeToken} from "react-jwt";
import {TokenData} from "../Login/TokenData";
import {VoteRepository} from "../../domain/Vote/VoteRepository";
import {VoteData} from "../../domain/Vote/VoteData";

export function MovieDetail({repository, userRepository, voteRepository}: {
                                repository: MovieRepository,
                                userRepository: UserRepository,
                                voteRepository: VoteRepository
                            }
) {
    const id = useParams() as { id: string };

    //TODO: Move all token management to class
    const {token} = useToken();
    const tokenData = decodeToken(token.token) as TokenData;
    const [movieData, setMovieData] = useState<Movie>();
    const [groupData, setGroupData] = useState<Group>();
    const [voteList, setVoteList] = useState<VoteData[]>([]);

    useEffect(() => {
        repository.findById(Number(id)).then((movieData) => setMovieData(movieData))
    }, []);

    useEffect(() => {
        userRepository.usersFromGroup(Number(tokenData.group_id), token.token).then(function (groupData) {
            const userList = groupData.user_list;
            let voteListData = [];
            for (const user of userList) {
                //TODO : cambiar por map
                voteListData.push({"user_id": String(user.id), "score": "-1", "user_name": user.name});
            }
            setVoteList(voteListData);
            setGroupData(groupData);
        })
    }, []);

    useEffect(() => {
        if (!groupData) {
            return;
        }
        voteRepository.getVotesForMovie(id.id, token.token).then((voteResponse) => {
            let newVoteList = [];
            const votesDone = voteResponse.votes;
            for(const initialVote of voteList){
                const voteOfUser = votesDone.filter((vote:VoteData) => vote.user_id === initialVote.user_id);
                newVoteList.push( voteOfUser.length > 0 ? {...voteOfUser[0], "user_name": initialVote.user_name} : initialVote );
            }
            setVoteList(newVoteList);
        })
    }, [groupData]);

    if (movieData === undefined || groupData === undefined) {
        return <></>;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await voteRepository.vote(id.id, voteList, token.token);
        if (result.ok) {
            const next = await voteRepository.findNextByUserIdAndFilmFestival(movieData.film_festival_id, token.token);
            window.location.href = `/movie/${next.id}`;
        }

    }

    const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVoteList(voteList.map((vote) => vote.user_id === e.target.dataset.id
            ? {...vote, "score": e.target.value}
            : {...vote}))
    };

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
        <div className={styles.break}></div>
        <span className={styles.movieDetail__group}>Votos del grupo {groupData?.name}</span>
        <form className={styles.movieDetail__form} onSubmit={handleSubmit}>
            {
                voteList.map(vote => (
                    <div className={styles.movieDetail__vote}>
                        <span><strong>{vote.user_name}</strong></span>
                        <div className="radio">
                            <label>
                                <input type="radio" value="-1"
                                       name={`user-${vote.user_id}`}
                                       data-id={vote.user_id}
                                       checked={vote.score === '-1'}
                                       onChange={onOptionChange}/>
                                Sin votar
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" value="0"
                                       name={`user-${vote.user_id}`}
                                       data-id={vote.user_id}
                                       checked={vote.score === '0'}
                                       onChange={onOptionChange}/>
                                No querer
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" value="1"
                                       name={`user-${vote.user_id}`}
                                       data-id={vote.user_id}
                                       checked={vote.score === '1'}
                                       onChange={onOptionChange}/>
                                Podría verla
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" value="2"
                                       name={`user-${vote.user_id}`}
                                       data-id={vote.user_id}
                                       checked={vote.score === '2'}
                                       onChange={onOptionChange}/>
                                Quiero verla
                            </label>
                        </div>
                    </div>
                ))
            }
            <button type="submit">Enviar votos</button>
        </form>

    </section>
        ;
}