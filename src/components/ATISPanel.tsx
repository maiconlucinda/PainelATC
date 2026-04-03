import type { ATISConfig, FrequencyConfig } from '../types';
import { useSession } from '../state/SessionContext';
import styles from './ATISPanel.module.css';

const ATIS_FIELDS: { key: keyof ATISConfig; label: string; placeholder: string }[] = [
    { key: 'airportName', label: 'Nome do aeroporto', placeholder: 'Ex: Salvador' },
    { key: 'letter', label: 'Letra ATIS', placeholder: 'Ex: A' },
    { key: 'runway', label: 'Pista em uso', placeholder: 'Ex: 10' },
    { key: 'windDirection', label: 'Direção do vento (graus)', placeholder: 'Ex: 180' },
    { key: 'windSpeed', label: 'Velocidade do vento (nós)', placeholder: 'Ex: 8' },
    { key: 'qnh', label: 'QNH (hPa)', placeholder: 'Ex: 1013' },
    { key: 'visibility', label: 'Visibilidade (metros)', placeholder: 'Ex: 9999' },
    { key: 'defaultSquawk', label: 'Transponder padrão', placeholder: 'Ex: 3345' },
];

const FREQ_FIELDS: { key: keyof FrequencyConfig; label: string; placeholder: string }[] = [
    { key: 'ground', label: 'Solo (GND)', placeholder: 'Ex: 121.7' },
    { key: 'tower', label: 'Torre (TWR)', placeholder: 'Ex: 118.3' },
    { key: 'departure', label: 'Saída (DEP)', placeholder: 'Ex: 119.0' },
];

export function ATISPanel() {
    const { state, dispatch } = useSession();

    const handleChange = (key: keyof ATISConfig, value: string) => {
        dispatch({ type: 'UPDATE_ATIS', payload: { [key]: value } });
    };

    const handleFreqChange = (key: keyof FrequencyConfig, value: string) => {
        dispatch({ type: 'UPDATE_FREQUENCIES', payload: { [key]: value } });
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>ATIS</h2>
                {state.atis.letter && (
                    <span className={styles.badge}>{state.atis.letter.toUpperCase()}</span>
                )}
            </div>

            <div className={styles.fields}>
                {ATIS_FIELDS.map((field) => (
                    <label key={field.key} className={styles.field}>
                        <span className={styles.label}>{field.label}</span>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={field.placeholder}
                            value={state.atis[field.key]}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                        />
                    </label>
                ))}
            </div>

            <div className={styles.header} style={{ marginTop: '1rem' }}>
                <h2 className={styles.title}>Frequências</h2>
            </div>

            <div className={styles.fields}>
                {FREQ_FIELDS.map((field) => (
                    <label key={field.key} className={styles.field}>
                        <span className={styles.label}>{field.label}</span>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={field.placeholder}
                            value={state.frequencies[field.key]}
                            onChange={(e) => handleFreqChange(field.key, e.target.value)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
