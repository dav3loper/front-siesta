import React, {useState} from "react";

export function Vote(props:any) {

    const [vote, setVote] = useState("no-voted");

    const onOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => { setVote(e.target.value)};

    return <div className={props.className}>
        <span><strong>{props.userName}</strong></span>
        <div className="radio">
            <label>
                <input type="radio" value="no-voted"
                       name={`user-${props.userId}`}
                       checked={vote === 'no-voted'}
                       onChange={onOptionChange}/>
                Sin votar
            </label>
        </div>
        <div className="radio">
            <label>
                <input type="radio" value="nope"
                       name={`user-${props.userId}`}
                       checked={vote === 'nope'}
                       onChange={onOptionChange}/>
                No querer
            </label>
        </div>
        <div className="radio">
            <label>
                <input type="radio" value="could-be"
                       name={`user-${props.userId}`}
                       checked={vote === 'could-be'}
                       onChange={onOptionChange}/>
                Podría verla
            </label>
        </div>
        <div className="radio">
            <label>
                <input type="radio" value="wanna-go"
                       name={`user-${props.userId}`}
                       checked={vote === 'wanna-go'}
                       onChange={onOptionChange}/>
                Quiero verla
            </label>
        </div>
    </div>;
}