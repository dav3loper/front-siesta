import React, {useEffect, useRef, useState} from "react";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import styles from "./AliasLabel.module.scss";

type LabelStatus = 'idle' | 'editing' | 'saving' | 'failed';

const ALIAS_MAX_LENGTH = 256;

// La etiqueta troquelada del expediente: un cuadrado al que le faltan la esquina superior
// izquierda y la inferior derecha, el mismo corte a 45 grados que el mixin cut-corner de
// los paneles, y el ojal por el que va atada al dossier.
const fileTag = <svg className={styles.tag} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M1.6 5.4 5.4 1.6h5v5L6.6 10.4z"/>
    <circle cx="7.9" cy="4.1" r="1"/>
</svg>;

export function AliasLabel({movieId, title, alias, repository, token, onRenamed}: {
    movieId: number,
    title: string,
    alias: string,
    repository: MovieRepository,
    token: string,
    onRenamed: (alias: string) => void
}) {
    const [status, setStatus] = useState<LabelStatus>('idle');
    const [draft, setDraft] = useState(alias);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === 'editing') {
            inputRef.current?.select();
        }
    }, [status]);

    const edit = () => {
        setDraft(alias);
        setStatus('editing');
    };

    const cancel = () => {
        setDraft(alias);
        setStatus('idle');
    };

    // Un alias en blanco es la forma de quitarlo, y el API lo espera como null.
    const save = async () => {
        const newAlias = draft.trim();
        if (newAlias === alias) {
            setStatus('idle');
            return;
        }
        setStatus('saving');
        try {
            const updatedMovie = await repository.updateAlias(movieId, newAlias === '' ? null : newAlias, token);
            onRenamed(updatedMovie.alias ?? '');
            setStatus('idle');
        } catch (error) {
            setStatus('failed');
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            save();
        }
        if (event.key === 'Escape') {
            cancel();
        }
    };

    if (status === 'idle') {
        return <span className={styles.label}>
            {alias && <span className={styles.alias}>{alias}</span>}
            <button type="button" className={styles.tagButton} onClick={edit}
                    title="Editar el alias · lo ven todos los grupos"
                    aria-label={alias ? `Cambiar el alias de ${title}` : `Poner alias a ${title}`}>
                {fileTag}
            </button>
        </span>;
    }

    return <span className={styles.label}>
        <input ref={inputRef} className={styles.input} value={draft} maxLength={ALIAS_MAX_LENGTH}
               aria-label={`Alias de ${title}`} disabled={status === 'saving'}
               onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown}/>
        <button type="button" className={`${styles.action} ${styles.confirm}`} onClick={save}
                disabled={status === 'saving'} aria-label={`Guardar el alias de ${title}`}>✓</button>
        <button type="button" className={styles.action} onClick={cancel}
                disabled={status === 'saving'} aria-label={`Descartar el cambio de alias de ${title}`}>✕</button>
        {status === 'failed' && <span className={styles.failed} role="alert">No se ha guardado · reintenta</span>}
    </span>;
}
