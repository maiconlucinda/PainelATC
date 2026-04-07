import { useEffect } from 'react';
import { useSession } from '../state/SessionContext';
import { getTemplates, getPilotTemplates } from '../data/phraseology';
import { PHASE_LABELS } from './AircraftItem';
import { TemplateRenderer } from './TemplateRenderer';
import { PhaseNavigator } from './PhaseNavigator';
import styles from './PhraseologyPanel.module.css';

export function PhraseologyPanel() {
    const { state, dispatch } = useSession();
    const { selectedAircraftCallsign, aircraft, atis, frequencies, position } = state;

    const selectedAircraft = aircraft.find(ac => ac.callsign === selectedAircraftCallsign);

    // Space = advance phase, Shift+Space = retreat phase
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedAircraftCallsign) return;
            const tag = (e.target as HTMLElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.code === 'Space') {
                e.preventDefault();
                if (e.shiftKey) {
                    dispatch({ type: 'RETREAT_PHASE', payload: selectedAircraftCallsign });
                } else {
                    dispatch({ type: 'ADVANCE_PHASE', payload: selectedAircraftCallsign });
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedAircraftCallsign, dispatch]);

    if (!selectedAircraft) {
        return (
            <div className={styles.panel}>
                <p className={styles.emptyMessage}>Selecione uma aeronave para ver a fraseologia</p>
            </div>
        );
    }

    const { currentPhase, language, callsign, fieldValues } = selectedAircraft;
    const isPilot = state.role === 'pilot';
    let templates = isPilot
        ? getPilotTemplates(currentPhase, language)
        : getTemplates(currentPhase, language);
    const phaseFieldValues = fieldValues[currentPhase] ?? {};

    // Controller-only filtering
    if (!isPilot) {
        // Hide handoff templates when operating as TWR Combined (no one to hand off to)
        if (position === 'TWR_COMBINED') {
            templates = templates.filter(t =>
                !t.segments.some(s => s.type === 'field' && s.value === 'frequência_handoff')
            );
        }
    }

    // Separate normal templates from exception templates (ids containing 'b' suffix = exceptions)
    // Exception separation only applies to controller mode
    const normalTemplates = isPilot ? templates : templates.filter(t => !t.id.endsWith('b'));
    const exceptionTemplates = isPilot ? [] : templates.filter(t => t.id.endsWith('b'));

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.phaseTitle}>{PHASE_LABELS[currentPhase]}</h2>
                <PhaseNavigator
                    callsign={callsign}
                    currentPhase={currentPhase}
                    position={position}
                    dispatch={dispatch}
                />
            </div>
            <div className={styles.templates}>
                {normalTemplates.map(template => (
                    <TemplateRenderer
                        key={template.id}
                        template={template}
                        fieldValues={phaseFieldValues}
                        atis={atis}
                        frequencies={frequencies}
                        callsign={callsign}
                        phase={currentPhase}
                        dispatch={dispatch}
                    />
                ))}
            </div>
            {exceptionTemplates.length > 0 && (
                <>
                    <div className={styles.exceptionDivider}>⚠️ Exceções</div>
                    <div className={styles.templates}>
                        {exceptionTemplates.map(template => (
                            <TemplateRenderer
                                key={template.id}
                                template={template}
                                fieldValues={phaseFieldValues}
                                atis={atis}
                                frequencies={frequencies}
                                callsign={callsign}
                                phase={currentPhase}
                                dispatch={dispatch}
                            />
                        ))}
                    </div>
                </>
            )}
            <div className={styles.notesRow}>
                <div className={styles.notesSection}>
                    <label className={styles.notesLabel}>📝 Notas gerais</label>
                    <textarea
                        className={styles.notesArea}
                        placeholder="Anotações da sessão..."
                        value={state.generalNotes}
                        onChange={(e) => dispatch({ type: 'UPDATE_GENERAL_NOTES', payload: e.target.value })}
                    />
                </div>
                <div className={styles.notesSection}>
                    <label className={styles.notesLabel}>✈️ Notas — {callsign}</label>
                    <textarea
                        className={styles.notesArea}
                        placeholder="Anotações sobre esta aeronave..."
                        value={selectedAircraft.notes}
                        onChange={(e) => dispatch({ type: 'UPDATE_NOTES', payload: { callsign, notes: e.target.value } })}
                    />
                </div>
            </div>
        </div>
    );
}
