import {Vote} from "./Vote";

export interface VoteRepository {
    findLastByUserId(userId: number): Promise<Vote>
}