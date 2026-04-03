import type { Aircraft, ControlPhase } from '../types';
import styles from './AircraftItem.module.css';

export const PHASE_LABELS: Record<ControlPhase, string> = {
    clearance: 'Autorização',
    pushback: 'Pushback',
    taxi_pre: 'Táxi Pré-Voo',
    takeoff: 'Decolagem',
    landing: 'Pouso',
    taxi_post: 'Táxi Pós-Pouso',
};

interface AircraftItemProps {
    aircraft: Aircraft;
    isSelected: boolean;
    onSelect: (callsign: string) => void;
    onToggleLanguage: (callsign: string) => void;
    onRemove: (callsign: string) => void;
}

export function AircraftItem({ aircraft, isSelected, onSelect, onToggleLanguage, onRemove }: AircraftItemProps) {
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
                <button
                    className={styles.langBadge}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLanguage(aircraft.callsign);
                    }}
                    title="Alternar idioma"
                >
                    {aircraft.language}
                </button>
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
