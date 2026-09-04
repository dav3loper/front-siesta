import {FormEvent, useState} from "react";
import {AgentRepository} from "../../domain/Agent/AgentRepository";
import {ChatMessage} from "../../domain/Agent/ChatMessage";
import useToken from "../Login/UseToken";
import {useAgentContext} from "./AgentContext";
import styles from "./AgentWidget.module.scss";

export function AgentWidget({agentRepository}: { agentRepository: AgentRepository }) {
    const {token} = useToken();
    const {movieContext} = useAgentContext();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text || sending) {
            return;
        }

        setMessages((prev) => [...prev, {role: 'user', text}, {role: 'agent', text: ''}]);
        setDraft('');
        setSending(true);
        setError('');

        try {
            await agentRepository.streamChat(text, token.token, (delta) => {
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {role: 'agent', text: next[next.length - 1].text + delta};
                    return next;
                });
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
                        <button type="button" className={styles.close} onClick={() => setOpen(false)}>×</button>
                    </div>
                    {movieContext && (
                        <p className={styles.context}>
                            {'// Contexto: '}{movieContext.title}{movieContext.year ? ` (${movieContext.year})` : ''}
                        </p>
                    )}
                    <div className={styles.log}>
                        {messages.length === 0 && (
                            <p className={styles.hint}>{'// Agente de guardia. Pregunta lo que necesites.'}</p>
                        )}
                        {messages.map((message, index) => (
                            <p key={index} className={`${styles.line} ${styles[`line--${message.role}`]}`}>
                                <span className={styles.tag}>{message.role === 'user' ? 'tú' : 'agente'}</span>
                                {message.text}
                            </p>
                        ))}
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
