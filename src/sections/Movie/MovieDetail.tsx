import React, {useEffect, useState} from "react";
import {Movie} from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {useParams} from "react-router-dom";
import styles from "./MovieDetail.module.scss";
import {UserRepository} from "../../domain/User/UserRepository";
import {Group} from "../../domain/User/Group";
import useToken from "../Login/UseToken";
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
    const userToken = token!;
    const [movieData, setMovieData] = useState<Movie>();
    const [groupData, setGroupData] = useState<Group>();
    const [voteList, setVoteList] = useState<VoteData[]>([]);

    useEffect(() => {
        repository.findById(Number(id.id), userToken.token).then((movieData) => {
            setMovieData(movieData)
        })
    }, []);

    useEffect(() => {
        userRepository.usersFromGroup(Number(userToken.groupId), userToken.token).then(function (groupData) {
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
        voteRepository.getVotesForMovie(id.id, userToken.token).then((voteResponse) => {
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
        const result = await voteRepository.vote(id.id, voteList, userToken.token);
        if (result.ok) {
            const next = await voteRepository.findNextByUserIdAndFilmFestival(movieData.film_festival_id, userToken.token);
            window.location.href = `/movie/${next.id}`;
        }

    }

    const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVoteList(voteList.map((vote) => vote.user_id === e.target.dataset.id
            ? {...vote, "score": e.target.value}
            : {...vote}))
    };

    const voteData = voteList.filter((vote) => parseInt(vote.score) > 0 );
    const movieScore = voteData
        .reduce((a, b) => {
            const toAdd = parseInt(b.score) > 1 ? b.user_name[0] : b.user_name[0].toLowerCase();
            return a + toAdd
        }, '').split('').sort().join('')

    const voteOptions: { value: string, modifier: string, label: string }[] = [
        {value: '-1', modifier: 'unvoted', label: 'Sin votar'},
        {value: '0', modifier: 'pass', label: 'No querer'},
        {value: '1', modifier: 'maybe', label: 'Podría verla'},
        {value: '2', modifier: 'want', label: 'Quiero verla'},
    ];

    const titleHeading = <h2>{movieData.title}</h2>;

    return <section className={styles.page}>
        <div className={styles.header}>
            {movieData.section && <p className={styles.eyebrow}>{movieData.section}</p>}
            <div className={styles.titleRow}>
                {movieData.link
                    ? <a className={styles.title} href={movieData.link} target="_blank" rel="noreferrer">{titleHeading}</a>
                    : <span className={styles.title}>{titleHeading}</span>}
                {movieData.duration > 0 && <span className={styles.duration}>{movieData.duration} min</span>}
                {movieData.alias && <span className={styles.alias}>“{movieData.alias}”</span>}
                {movieScore && <span className={styles.code}>{movieScore}</span>}
            </div>
            {movieData.sessions && movieData.sessions.length > 0 &&
                <div className={styles.sessions}>
                    {movieData.sessions.map(session => (
                        <span key={`${session.location}-${session.init_date}`} className={styles.meta}>
                            <strong>{session.location}</strong> · {session.init_date}
                        </span>
                    ))}
                </div>
            }
        </div>

        <div className={styles.media}>
            {movieData.poster
                ? <img className={styles.poster} src={movieData.poster} alt={movieData.title}/>
                : <div className={styles.posterPlaceholder}>Cartel<br/>próximamente</div>}
            {movieData.trailer
                ? <iframe title={movieData.title} className={styles.trailer}
                          src={`https://www.youtube.com/embed/${movieData.trailer}?rel=0&amp;showinfo=0`} frameBorder="0"
                          allow="autoplay; encrypted-media" allowFullScreen></iframe>
                : <div className={styles.trailerPlaceholder}>Tráiler próximamente</div>}
        </div>

        {movieData.summary && <p className={styles.summary}>{movieData.summary}</p>}

        <form className={styles.ballot} onSubmit={handleSubmit}>
            <p className={styles.ballotLabel}>Papeleta del grupo <strong>{groupData?.name}</strong></p>
            {voteList.map(vote => (
                <div className={styles.row} key={vote.user_id}>
                    <span className={styles.rowName}>{vote.user_name}</span>
                    <div className={styles.options}>
                        {voteOptions.map(option => (
                            <label key={option.value}
                                   className={`${styles.stamp} ${styles[`stamp--${option.modifier}`]}`}>
                                <input type="radio" value={option.value}
                                       className={styles.stampInput}
                                       name={`user-${vote.user_id}`}
                                       data-id={vote.user_id}
                                       checked={vote.score === option.value}
                                       onChange={onOptionChange}/>
                                <span className={styles.dot} aria-hidden="true"/>
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button type="submit" className={styles.submit}>Enviar votos</button>
        </form>
    </section>;
}