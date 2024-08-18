import styles from "./Vote.module.scss";
import React, {useState} from "react";

export function Vote(props:any) {

    const [vote, setVote] = useState("no-voted");

    const onOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => { setVote(e.target.value)};

    return <form className={props.className}>
        <div className="radio">
            <label>
                <input type="radio" value="no-voted"
                       checked={vote === 'no-voted'}
                       onChange={onOptionChange}/>
                Sin votar
            </label>
        </div>
        <div className="radio">
            <label>
                <input type="radio" value="nope"
                       checked={vote === 'nope'}
                       onChange={onOptionChange}/>
                No querer
            </label>
        </div>
        <div className="radio">
            <label>
                <input type="radio" value="could-be"
                       checked={vote === 'could-be'}
                       onChange={onOptionChange}/>
                Podría verla
            </label>
        </div>
        <div className="radio">
            <label>
                <input type="radio" value="wanna-go"
                       checked={vote === 'wanna-go'}
                       onChange={onOptionChange}/>
                Quiero verla
            </label>
        </div>
        <button type={"submit"}>Enviar</button>
    </form>;
}