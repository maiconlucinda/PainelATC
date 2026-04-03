import type { ATCPosition, SessionState } from '../types';
import { useSession } from '../state/SessionContext';
import { clearSavedSession } from '../utils/persistence';
import styles from './SessionRestoreDialog.module.css';

const POSITION_LABELS: Record<ATCPosition, string> = {
    DEL: 'Clearance Delivery',
    GND: 'Ground / Solo',
    TWR: 'Torre',
    TWR_COMBINED: 'Torre Combinada',
};

interface SessionRestoreDialogProps {
    savedSession: SessionState;
}

export function SessionRestoreDialog({ savedSession }: SessionRestoreDialogProps) {
    const { dispatch } = useSession();

    const positionLabel = POSITION_LABELS[savedSession.position];
    const aircraftCount = savedSession.aircraft.length;

    function handleRestore() {
        dispatch({ type: 'RESTORE_SESSION', payload: savedSession });
    }

    function handleNewSession() {
        dispatch({ type: 'CLEAR_SESSION' });
        clearSavedSession();
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog} role="dialog" aria-labelledby="restore-title">
                <h2 id="restore-title" className={styles.title}>Sessão anterior encontrada</h2>
                <p className={styles.description}>
                    Existe uma sessão salva no navegador. Deseja continuar de onde parou?
                </p>
                <div className={styles.summary}>
                    <span><strong>Posição:</strong> {positionLabel}</span>
                    <span><strong>Aeronaves:</strong> {aircraftCount}</span>
                </div>
                <div className={styles.actions}>
                    <button className={styles.restoreBtn} onClick={handleRestore}>
                        Continuar Sessão
                    </button>
                    <button className={styles.newBtn} onClick={handleNewSession}>
                        Nova Sessão
                    </button>
                </div>
            </div>
        </div>
    );
}
