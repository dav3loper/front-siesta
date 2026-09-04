export interface MovieContext {
    title: string;
    year?: number;
}

export interface AgentRepository {
    streamChat(message: string, token: string, onDelta: (text: string) => void, movieContext?: MovieContext): Promise<void>;
}
