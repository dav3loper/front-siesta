import {AgentRepository, AgentStreamHandlers, MovieContext} from "../../domain/Agent/AgentRepository";

export class AsyncFetchAgentRepository implements AgentRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    async streamChat(message: string, conversationId: string, token: string, handlers: AgentStreamHandlers, movieContext?: MovieContext): Promise<void> {
        const body = movieContext
            ? {message, conversation_id: conversationId, context: {movie_title: movieContext.title, movie_year: movieContext.year}}
            : {message, conversation_id: conversationId};

        const response = await fetch(this.host + `/agent/chat`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.status === 429) {
            throw new Error('Has superado el límite de consultas por hora. Prueba de nuevo más tarde.');
        }

        if (!response.ok || !response.body) {
            throw new Error('Algo ha ido mal');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const {done, value} = await reader.read();
            if (done) {
                break;
            }
            buffer += decoder.decode(value, {stream: true});

            let boundary = buffer.indexOf('\n\n');
            while (boundary !== -1) {
                const rawEvent = buffer.slice(0, boundary);
                buffer = buffer.slice(boundary + 2);
                if (this.handleEvent(rawEvent, handlers)) {
                    await reader.cancel();
                    return;
                }
                boundary = buffer.indexOf('\n\n');
            }
        }
    }

    private handleEvent(rawEvent: string, handlers: AgentStreamHandlers): boolean {
        const lines = rawEvent.split('\n');
        const eventLine = lines.find((line) => line.startsWith('event:'));
        const name = eventLine ? eventLine.slice('event:'.length).trim() : 'message';

        if (name === 'done') {
            return true;
        }

        const dataLines = lines.filter((line) => line.startsWith('data:'));
        if (dataLines.length === 0) {
            return false;
        }
        const data = JSON.parse(dataLines.map((line) => line.slice('data:'.length).trimStart()).join('\n'));

        switch (name) {
            case 'message':
                handlers.onDelta(data.text);
                return false;
            case 'warning':
                handlers.onUnknownTitles(data.unknown_titles);
                return false;
            case 'error':
                handlers.onStreamError(data.error);
                return true;
            default:
                return false;
        }
    }

}
