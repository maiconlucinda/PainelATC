import { useState } from 'react';
import type { ATCPosition, UserRole } from '../types';
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
    const [role, setRole] = useState<UserRole | null>(null);
    const [selected, setSelected] = useState<ATCPosition>('TWR_COMBINED');

    const handleStart = () => {
        dispatch({ type: 'SET_POSITION', payload: selected });
        dispatch({ type: 'START_SESSION' });
    };

    const handlePilotStart = () => {
        dispatch({ type: 'SET_ROLE', payload: 'pilot' });
        dispatch({ type: 'SET_POSITION', payload: 'TWR_COMBINED' });
        dispatch({ type: 'START_SESSION' });
    };

    if (!role) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Painel ATC</h1>
                <p className={styles.subtitle}>Selecione o seu papel</p>
                <div className={styles.roleOptions}>
                    <button
                        className={styles.roleButton}
                        onClick={() => setRole('controller')}
                    >
                        <span className={styles.roleIcon}>🎧</span>
                        <span className={styles.roleLabel}>Controlador</span>
                        <span className={styles.roleDesc}>Fraseologia ATC (torre, solo, DEL)</span>
                    </button>
                    <button
                        className={styles.roleButton}
                        onClick={() => handlePilotStart()}
                    >
                        <span className={styles.roleIcon}>✈️</span>
                        <span className={styles.roleLabel}>Piloto</span>
                        <span className={styles.roleDesc}>Fraseologia do piloto (comunicação com ATC)</span>
                    </button>
                </div>
            </div>
        );
    }

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

            <div className={styles.buttonRow}>
                <button className={styles.backButton} onClick={() => setRole(null)}>
                    Voltar
                </button>
                <button className={styles.startButton} onClick={handleStart}>
                    Iniciar Sessão
                </button>
            </div>
        </div>
    );
}
