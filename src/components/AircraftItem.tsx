import type { Aircraft, ControlPhase, Language } from '../types';
import styles from './AircraftItem.module.css';

export const PHASE_LABELS: Record<ControlPhase, string> = {
    clearance: 'Autorização',
    pushback: 'Pushback',
    taxi_pre: 'Táxi Pré-Voo',
    takeoff: 'Decolagem',
    landing: 'Pouso',
    taxi_post: 'Táxi Pós-Pouso',
};

const LANGUAGES: Language[] = ['PT', 'EN', 'ES'];

interface AircraftItemProps {
    aircraft: Aircraft;
    isSelected: boolean;
    onSelect: (callsign: string) => void;
    onSetLanguage: (callsign: string, language: Language) => void;
    onRemove: (callsign: string) => void;
}

export function AircraftItem({ aircraft, isSelected, onSelect, onSetLanguage, onRemove }: AircraftItemProps) {
    return (
        <div
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            onClick={() => onSelect(aircraft.callsign)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(aircraft.callsign);
                }
            }}
        >
            <div className={styles.info}>
                <div className={styles.callsign}>{aircraft.callsign}</div>
                <div className={styles.phase}>{PHASE_LABELS[aircraft.currentPhase]}</div>
            </div>
            <div className={styles.actions}>
                <div className={styles.langGroup}>
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang}
                            className={`${styles.langBtn} ${aircraft.language === lang ? styles.langActive : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSetLanguage(aircraft.callsign, lang);
                            }}
                            title={`Idioma ${lang}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
                <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(aircraft.callsign);
                    }}
                    title="Remover aeronave"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
