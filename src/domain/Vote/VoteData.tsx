export interface VoteResponse {
    votes: VoteData[]
}

export interface VoteData {
    user_id: string;
    user_name: string;
    score: string;
}