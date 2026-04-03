import { useState } from 'react';
import { useSession } from '../state/SessionContext';
import styles from './RunwayConfig.module.css';

export function RunwayConfig() {
    const { state, dispatch } = useSession();
    const [input, setInput] = useState('');

    const handleAdd = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        dispatch({ type: 'ADD_RUNWAY', payload: trimmed });
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    };

    return (
        <div className={styles.panel}>
            <h2 className={styles.title}>Pistas</h2>

            <div className={styles.addRow}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Identificador (ex: 10)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className={styles.addButton} onClick={handleAdd}>
                    Adicionar
                </button>
            </div>

            {state.runways.length > 0 && (
                <ul className={styles.list} role="radiogroup" aria-label="Pista ativa">
                    {state.runways.map((rwy) => (
                        <li key={rwy.id} className={styles.item}>
                            <label className={styles.runwayLabel}>
                                <input
                                    type="radio"
                                    name="active-runway"
                                    className={styles.radio}
                                    checked={rwy.isActive}
                                    onChange={() => dispatch({ type: 'SET_ACTIVE_RUNWAY', payload: rwy.id })}
                                />
                                <span className={styles.identifier}>{rwy.identifier}</span>
                                {rwy.isActive && <span className={styles.activeBadge}>Ativa</span>}
                            </label>
                            <button
                                className={styles.removeButton}
                                onClick={() => dispatch({ type: 'REMOVE_RUNWAY', payload: rwy.id })}
                                aria-label={`Remover pista ${rwy.identifier}`}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {state.runways.length === 0 && (
                <p className={styles.empty}>Nenhuma pista configurada</p>
            )}
        </div>
    );
}
