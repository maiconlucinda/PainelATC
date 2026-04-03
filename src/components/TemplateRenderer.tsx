import type { Dispatch } from 'react';
import type { PhraseologyTemplate, ATISConfig, FrequencyConfig, ControlPhase, SessionAction } from '../types';
import { resolveFreqKey } from '../utils/templates';
import { EditableField } from './EditableField';
import { CopyButton } from './CopyButton';
import styles from './TemplateRenderer.module.css';

/**
 * Maps ATIS field names (PT and EN variants) to ATISConfig keys.
 */
const ATIS_FIELD_MAP: Record<string, keyof ATISConfig> = {
    pista: 'runway',
    runway: 'runway',
    letra_ATIS: 'letter',
    atis_letter: 'letter',
    'direção': 'windDirection',
    direction: 'windDirection',
    velocidade: 'windSpeed',
    speed: 'windSpeed',
    QNH: 'qnh',
    qnh: 'qnh',
    aeroporto: 'airportName',
    'código transponder': 'defaultSquawk',
};

interface TemplateRendererProps {
    template: PhraseologyTemplate;
    fieldValues: Record<string, string>;
    atis: ATISConfig;
    frequencies: FrequencyConfig;
    callsign: string;
    phase: ControlPhase;
    dispatch: Dispatch<SessionAction>;
}

export function TemplateRenderer({ template, fieldValues, atis, frequencies, callsign, phase, dispatch }: TemplateRendererProps) {
    return (
        <div className={styles.templateLine}>
            <span className={styles.segments}>
                {template.segments.map((segment, i) => {
                    if (segment.type === 'text') {
                        return (
                            <span key={i} className={styles.textSegment}>
                                {segment.value}
                            </span>
                        );
                    }

                    const fieldName = segment.value;

                    // Auto-filled: callsign
                    if (fieldName === 'callsign') {
                        return (
                            <span key={i} className={styles.autoFilled}>
                                {callsign}
                            </span>
                        );
                    }

                    // Auto-filled: ATIS fields
                    const atisKey = ATIS_FIELD_MAP[fieldName];
                    if (atisKey !== undefined && atis[atisKey]) {
                        return (
                            <span key={i} className={styles.autoFilled}>
                                {atis[atisKey]}
                            </span>
                        );
                    }

                    // Auto-filled: Frequency fields
                    const freqKey = resolveFreqKey(fieldName, template.phase);
                    if (freqKey !== undefined && frequencies[freqKey]) {
                        return (
                            <span key={i} className={styles.autoFilled}>
                                {frequencies[freqKey]}
                            </span>
                        );
                    }

                    // Editable field
                    return (
                        <EditableField
                            key={i}
                            fieldName={fieldName}
                            value={fieldValues[fieldName] ?? ''}
                            callsign={callsign}
                            phase={phase}
                            dispatch={dispatch}
                        />
                    );
                })}
            </span>
            <CopyButton
                template={template}
                fieldValues={fieldValues}
                atis={atis}
                callsign={callsign}
                frequencies={frequencies}
            />
        </div>
    );
}
