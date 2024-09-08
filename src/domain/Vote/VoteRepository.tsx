import {VoteData} from "./VoteData";

export interface VoteRepository {
    vote(id: string, loginData: VoteData[], token: string): Promise<any>
}