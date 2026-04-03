import type { ATCPosition } from './types';
import { useSession } from './state/SessionContext';
import { PositionSelector } from './components/PositionSelector';
import { SessionRestoreDialog } from './components/SessionRestoreDialog';
import { AircraftList } from './components/AircraftList';
import { ATISPanel } from './components/ATISPanel';
import { RunwayConfig } from './components/RunwayConfig';
import { PhraseologyPanel } from './components/PhraseologyPanel';
import { NewSessionButton } from './components/NewSessionButton';
import styles from './App.module.css';

const POSITION_LABELS: Record<ATCPosition, string> = {
  DEL: 'Clearance Delivery (DEL)',
  GND: 'Ground / Solo (GND)',
  TWR: 'Torre (TWR)',
  TWR_COMBINED: 'Torre Combinada',
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
        <span className={styles.positionBadge}>{POSITION_LABELS[state.position]}</span>
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
        <aside className={styles.sidebar}>
          <AircraftList />
          <ATISPanel />
          <RunwayConfig />
        </aside>
        <main className={styles.main}>
          <PhraseologyPanel />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
