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

export const PHASE_COLORS: Record<ControlPhase, string> = {
    clearance: '#9b59b6',
    pushback: '#3498db',
    taxi_pre: '#f1c40f',
    takeoff: '#2ecc71',
    landing: '#e67e22',
    taxi_post: '#95a5a6',
};

const LANGUAGES: Language[] = ['PT', 'EN', 'ES'];

interface AircraftItemProps {
    aircraft: Aircraft;
    isSelected: boolean;
    isFirst: boolean;
    isLast: boolean;
    onSelect: (callsign: string) => void;
    onSetLanguage: (callsign: string, language: Language) => void;
    onRemove: (callsign: string) => void;
    onMove: (callsign: string, direction: 'up' | 'down') => void;
}

export function AircraftItem({ aircraft, isSelected, isFirst, isLast, onSelect, onSetLanguage, onRemove, onMove }: AircraftItemProps) {
    const phaseColor = PHASE_COLORS[aircraft.currentPhase];
    return (
        <div
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            style={{
                borderColor: phaseColor,
                backgroundColor: isSelected ? `${phaseColor}18` : undefined,
            }}
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
                <div className={styles.phase} style={{ color: phaseColor }}>{PHASE_LABELS[aircraft.currentPhase]}</div>
            </div>
            <div className={styles.actions}>
                <button
                    className={styles.moveBtn}
                    disabled={isFirst}
                    onClick={(e) => { e.stopPropagation(); onMove(aircraft.callsign, 'up'); }}
                    title="Mover para esquerda"
                >◀</button>
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
                    className={styles.moveBtn}
                    disabled={isLast}
                    onClick={(e) => { e.stopPropagation(); onMove(aircraft.callsign, 'down'); }}
                    title="Mover para direita"
                >▶</button>
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
