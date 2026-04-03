import { useState } from 'react';
import type { ATCPosition } from '../types';
import { useSession } from '../state/SessionContext';
import styles from './PositionSelector.module.css';

const POSITION_OPTIONS: { value: ATCPosition; label: string; description: string }[] = [
    { value: 'DEL', label: 'Clearance Delivery (DEL)', description: 'Somente autorização de voo' },
    { value: 'GND', label: 'Ground / Solo (GND)', description: 'Pushback, acionamento e táxi' },
    { value: 'TWR', label: 'Torre (TWR)', description: 'Decolagem, pouso e táxi pós-pouso' },
    { value: 'TWR_COMBINED', label: 'Torre Combinada', description: 'Todas as posições (sem controladores abaixo)' },
];

export function PositionSelector() {
    const { dispatch } = useSession();
    const [selected, setSelected] = useState<ATCPosition>('TWR_COMBINED');

    const handleStart = () => {
        dispatch({ type: 'SET_POSITION', payload: selected });
        dispatch({ type: 'START_SESSION' });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Painel ATC</h1>
            <p className={styles.subtitle}>Selecione a posição de controle para iniciar</p>

            <div className={styles.options} role="radiogroup" aria-label="Posição ATC">
                {POSITION_OPTIONS.map((opt) => (
                    <label
                        key={opt.value}
                        className={`${styles.option} ${selected === opt.value ? styles.optionSelected : ''}`}
                    >
                        <input
                            type="radio"
                            name="atc-position"
                            className={styles.radio}
                            value={opt.value}
                            checked={selected === opt.value}
                            onChange={() => setSelected(opt.value)}
                        />
                        <span className={styles.optionText}>
                            <span className={styles.optionLabel}>{opt.label}</span>
                            <span className={styles.optionDesc}>{opt.description}</span>
                        </span>
                    </label>
                ))}
            </div>

            <button className={styles.startButton} onClick={handleStart}>
                Iniciar Sessão
            </button>
        </div>
    );
}
