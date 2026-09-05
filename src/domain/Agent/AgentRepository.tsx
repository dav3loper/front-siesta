export interface MovieContext {
    title: string;
    year?: number;
}

export interface AgentStreamHandlers {
    onDelta: (text: string) => void;
    onUnknownTitles: (titles: string[]) => void;
    onStreamError: (message: string) => void;
}

export interface AgentRepository {
    streamChat(message: string, token: string, handlers: AgentStreamHandlers, movieContext?: MovieContext): Promise<void>;
}
