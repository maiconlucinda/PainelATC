import { useState, type FormEvent } from 'react';
import { useSession } from '../state/SessionContext';
import { isCallsignUnique } from '../utils/validation';
import { AircraftItem } from './AircraftItem';
import styles from './AircraftList.module.css';

export function AircraftList() {
    const { state, dispatch } = useSession();
    const [callsignInput, setCallsignInput] = useState('');
    const [error, setError] = useState('');

    const handleAdd = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = callsignInput.trim().toUpperCase();
        if (!trimmed) return;

        if (!isCallsignUnique(trimmed, state.aircraft)) {
            setError('Callsign já em uso');
            return;
        }

        dispatch({ type: 'ADD_AIRCRAFT', payload: trimmed });
        setCallsignInput('');
        setError('');
    };

    const handleInputChange = (value: string) => {
        setCallsignInput(value.toUpperCase());
        if (error) setError('');
    };

    return (
        <div className={styles.bar}>
            <div className={styles.list}>
                {state.aircraft.length === 0 ? (
                    <span className={styles.empty}>Nenhuma aeronave</span>
                ) : (
                    state.aircraft.map((ac, index) => (
                        <AircraftItem
                            key={ac.callsign}
                            aircraft={ac}
                            isSelected={state.selectedAircraftCallsign === ac.callsign}
                            isFirst={index === 0}
                            isLast={index === state.aircraft.length - 1}
                            onSelect={(cs) => dispatch({ type: 'SELECT_AIRCRAFT', payload: cs })}
                            onSetLanguage={(cs, lang) => dispatch({ type: 'SET_LANGUAGE', payload: { callsign: cs, language: lang } })}
                            onRemove={(cs) => dispatch({ type: 'REMOVE_AIRCRAFT', payload: cs })}
                            onMove={(cs, dir) => dispatch({ type: 'MOVE_AIRCRAFT', payload: { callsign: cs, direction: dir } })}
                        />
                    ))
                )}
            </div>
            <form className={styles.addForm} onSubmit={handleAdd}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Callsign"
                    value={callsignInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
                <button type="submit" className={styles.addBtn}>+</button>
            </form>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}
