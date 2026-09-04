import {AgentRepository, MovieContext} from "../../domain/Agent/AgentRepository";

export class AsyncFetchAgentRepository implements AgentRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    async streamChat(message: string, token: string, onDelta: (text: string) => void, movieContext?: MovieContext): Promise<void> {
        const body = movieContext
            ? {message, context: {movie_title: movieContext.title, movie_year: movieContext.year}}
            : {message};

        const response = await fetch(this.host + `/agent/chat`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

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
                const dataLine = rawEvent.split('\n').find((line) => line.startsWith('data: '));
                if (dataLine) {
                    const {text} = JSON.parse(dataLine.slice('data: '.length));
                    onDelta(text);
                }
                boundary = buffer.indexOf('\n\n');
            }
        }
    }

}
