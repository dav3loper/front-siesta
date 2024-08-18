import {Vote} from "../../domain/Dashboard/Vote";
import {VoteRepository} from "../../domain/Dashboard/VoteRepository";

export class FakeVoteRepository implements VoteRepository {
    findLastByUserId(userId: number): Promise<Vote> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    movieId: 1,
                    userId: 11,
                    vote: "d"
                });
            }, 1000);
        });
    }
}