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
        <div className={styles.panel}>
            <h2 className={styles.title}>Aeronaves</h2>

            <form className={styles.addForm} onSubmit={handleAdd}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Callsign"
                    value={callsignInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
                <button type="submit" className={styles.addBtn}>
                    Adicionar
                </button>
            </form>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.list}>
                {state.aircraft.length === 0 ? (
                    <div className={styles.empty}>Nenhuma aeronave adicionada</div>
                ) : (
                    state.aircraft.map((ac) => (
                        <AircraftItem
                            key={ac.callsign}
                            aircraft={ac}
                            isSelected={state.selectedAircraftCallsign === ac.callsign}
                            onSelect={(cs) => dispatch({ type: 'SELECT_AIRCRAFT', payload: cs })}
                            onToggleLanguage={(cs) => dispatch({ type: 'TOGGLE_LANGUAGE', payload: cs })}
                            onRemove={(cs) => dispatch({ type: 'REMOVE_AIRCRAFT', payload: cs })}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
