import { useSession } from '../state/SessionContext';
import { getTemplates } from '../data/phraseology';
import { PHASE_LABELS } from './AircraftItem';
import { TemplateRenderer } from './TemplateRenderer';
import { PhaseNavigator } from './PhaseNavigator';
import styles from './PhraseologyPanel.module.css';

export function PhraseologyPanel() {
    const { state, dispatch } = useSession();
    const { selectedAircraftCallsign, aircraft, atis, frequencies, position } = state;

    const selectedAircraft = aircraft.find(ac => ac.callsign === selectedAircraftCallsign);

    if (!selectedAircraft) {
        return (
            <div className={styles.panel}>
                <p className={styles.emptyMessage}>Selecione uma aeronave para ver a fraseologia</p>
            </div>
        );
    }

    const { currentPhase, language, callsign, fieldValues } = selectedAircraft;
    let templates = getTemplates(currentPhase, language);
    const phaseFieldValues = fieldValues[currentPhase] ?? {};

    // Hide handoff templates when operating as TWR Combined (no one to hand off to)
    if (position === 'TWR_COMBINED') {
        templates = templates.filter(t =>
            !t.segments.some(s => s.type === 'field' && s.value === 'frequência_handoff')
        );
    }

    // Separate normal templates from exception templates (ids containing 'b' suffix = exceptions)
    const normalTemplates = templates.filter(t => !t.id.endsWith('b'));
    const exceptionTemplates = templates.filter(t => t.id.endsWith('b'));

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
        </div>
    );
}
