import {VoteRepository} from "../../domain/Vote/VoteRepository";
import {VoteData} from "../../domain/Vote/VoteData";

export class AsynFetchVoteRepository implements VoteRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    async vote(id: string, voteData: VoteData[], token: string): Promise<any> {
        return fetch(this.host + `/movie/${id}/vote`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(voteData)
        });

    }
}