import type { ATCPosition, UserRole } from './types';
import { useSession } from './state/SessionContext';
import { PositionSelector } from './components/PositionSelector';
import { SessionRestoreDialog } from './components/SessionRestoreDialog';
import { AircraftList } from './components/AircraftList';
import { ATISPanel } from './components/ATISPanel';
import { PhraseologyPanel } from './components/PhraseologyPanel';
import { NewSessionButton } from './components/NewSessionButton';
import styles from './App.module.css';

const POSITION_LABELS: Record<ATCPosition, string> = {
  DEL: 'Clearance Delivery (DEL)',
  GND: 'Ground / Solo (GND)',
  TWR: 'Torre (TWR)',
  TWR_COMBINED: 'Torre Combinada',
};

const ROLE_LABELS: Record<UserRole, string> = {
  controller: 'Controlador',
  pilot: 'Piloto',
};

function AppContent() {
  const { state, dispatch, savedSession } = useSession();

  if (savedSession) {
    return <SessionRestoreDialog savedSession={savedSession} />;
  }

  if (!state.sessionStarted) {
    return <PositionSelector />;
  }

  const handleChangePosition = () => {
    dispatch({ type: 'CLEAR_SESSION' });
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel ATC</h1>
        <span className={styles.positionBadge}>
          {state.role === 'pilot' ? ROLE_LABELS.pilot : POSITION_LABELS[state.position]}
        </span>
        <button className={styles.changePositionBtn} onClick={handleChangePosition}>
          Trocar Posição
        </button>
        <div className={styles.headerSpacer} />
        {state.atis.letter && (
          <span className={styles.atisBadge} title={`ATIS ${state.atis.letter.toUpperCase()}`}>
            {state.atis.letter.toUpperCase()}
          </span>
        )}
        <NewSessionButton />
      </header>
      <div className={styles.body}>
        {state.role === 'controller' && (
          <aside className={styles.sidebar}>
            <ATISPanel />
          </aside>
        )}
        <main className={styles.main}>
          <AircraftList />
          <PhraseologyPanel />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
