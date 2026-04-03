import type { Dispatch } from 'react';
import type { ATCPosition, ControlPhase, SessionAction } from '../types';
import { getVisiblePhases } from '../utils/phases';
import styles from './PhaseNavigator.module.css';

interface PhaseNavigatorProps {
    callsign: string;
    currentPhase: ControlPhase;
    position: ATCPosition;
    dispatch: Dispatch<SessionAction>;
}

export function PhaseNavigator({ callsign, currentPhase, position, dispatch }: PhaseNavigatorProps) {
    const visiblePhases = getVisiblePhases(position);
    const currentIndex = visiblePhases.indexOf(currentPhase);
    const isFirst = currentIndex <= 0;
    const isLast = currentIndex >= visiblePhases.length - 1;

    return (
        <div className={styles.navigator}>
            <button
                className={styles.btn}
                disabled={isFirst}
                onClick={() => dispatch({ type: 'RETREAT_PHASE', payload: callsign })}
            >
                ◀ Anterior
            </button>
            <button
                className={styles.btn}
                disabled={isLast}
                onClick={() => dispatch({ type: 'ADVANCE_PHASE', payload: callsign })}
            >
                Próxima ▶
            </button>
        </div>
    );
}
