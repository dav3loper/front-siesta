import {FormEvent, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {AgentRepository} from "../../domain/Agent/AgentRepository";
import {ChatMessage} from "../../domain/Agent/ChatMessage";
import useToken from "../Login/UseToken";
import {useAgentContext} from "./AgentContext";
import styles from "./AgentWidget.module.scss";

const THREAD_STORAGE_KEY = 'agent-thread';

interface AgentThread {
    pathname: string;
    conversationId: string;
    messages: ChatMessage[];
}

function loadThread(pathname: string): AgentThread {
    const stored = sessionStorage.getItem(THREAD_STORAGE_KEY);
    if (stored) {
        const thread = JSON.parse(stored) as AgentThread;
        if (thread.pathname === pathname) {
            return thread;
        }
    }
    return {pathname, conversationId: crypto.randomUUID(), messages: []};
}

export function AgentWidget({agentRepository}: { agentRepository: AgentRepository }) {
    const {token} = useToken();
    const {movieContext} = useAgentContext();
    const {pathname} = useLocation();
    const [open, setOpen] = useState(false);
    const [thread, setThread] = useState<AgentThread>(() => loadThread(pathname));
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [unknownTitles, setUnknownTitles] = useState<string[]>([]);

    useEffect(() => {
        if (thread.pathname !== pathname) {
            setThread(loadThread(pathname));
            return;
        }
        sessionStorage.setItem(THREAD_STORAGE_KEY, JSON.stringify(thread));
    }, [pathname, thread]);

    const startNewConversation = () => {
        setError('');
        setUnknownTitles([]);
        setThread({pathname, conversationId: crypto.randomUUID(), messages: []});
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text || sending) {
            return;
        }

        setThread((prev) => ({
            ...prev,
            messages: [...prev.messages, {role: 'user', text}, {role: 'agent', text: ''}]
        }));
        setDraft('');
        setSending(true);
        setError('');
        setUnknownTitles([]);

        try {
            await agentRepository.streamChat(text, thread.conversationId, token.token, {
                onDelta: (delta) => {
                    setThread((prev) => {
                        const messages = [...prev.messages];
                        messages[messages.length - 1] = {
                            role: 'agent',
                            text: messages[messages.length - 1].text + delta
                        };
                        return {...prev, messages};
                    });
                },
                onUnknownTitles: (titles) => setUnknownTitles(titles),
                onStreamError: (streamError) => setError(streamError)
            }, movieContext);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={styles.widget}>
            {open && (
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <span className={styles.status}>
                            <span className={`${styles.led} ${sending ? styles["led--active"] : ''}`}/>
                            {sending ? 'Transmitiendo' : 'Canal abierto'}
                        </span>
                        <span className={styles.actions}>
                            <button type="button" className={styles.reset} onClick={startNewConversation}
                                    disabled={sending || thread.messages.length === 0}>
                                {'// nuevo hilo'}
                            </button>
                            <button type="button" className={styles.close} onClick={() => setOpen(false)}>×</button>
                        </span>
                    </div>
                    {movieContext && (
                        <p className={styles.context}>
                            {'// Contexto: '}{movieContext.title}{movieContext.year ? ` (${movieContext.year})` : ''}
                        </p>
                    )}
                    <div className={styles.log}>
                        {thread.messages.length === 0 && (
                            <p className={styles.hint}>{'// Agente de guardia. Pregunta lo que necesites.'}</p>
                        )}
                        {thread.messages.map((message, index) => (
                            <p key={index} className={`${styles.line} ${styles[`line--${message.role}`]}`}>
                                <span className={styles.tag}>{message.role === 'user' ? 'tú' : 'agente'}</span>
                                {message.text}
                            </p>
                        ))}
                        {unknownTitles.length > 0 && (
                            <p className={styles.warning}>
                                {'// Sin confirmar en el catálogo: '}{unknownTitles.join(', ')}
                            </p>
                        )}
                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input
                            className={styles.input}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Transmite tu mensaje..."
                            disabled={sending}
                        />
                        <button type="submit" className={styles.send} disabled={sending}>&gt;</button>
                    </form>
                </div>
            )}
            <button type="button" className={styles.fab} onClick={() => setOpen((prev) => !prev)}
                    aria-label="Abrir canal con el agente">
                <span className={styles.fabCore}/>
            </button>
        </div>
    );
}
