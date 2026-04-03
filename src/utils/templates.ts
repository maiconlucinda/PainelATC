import type { PhraseologyTemplate, ATISConfig, FrequencyConfig } from '../types';

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

/**
 * Maps frequency handoff field names to FrequencyConfig keys.
 */
export const FREQ_FIELD_MAP: Record<string, keyof FrequencyConfig> = {
    'frequência_handoff': 'ground',
    'frequência': 'departure',
};

/**
 * Resolves the correct frequency key based on the template phase context.
 * - clearance/pushback handoff → ground frequency
 * - taxi_pre handoff → tower frequency
 * - takeoff handoff → departure frequency
 */
export function resolveFreqKey(fieldName: string, phase: string): keyof FrequencyConfig | undefined {
    if (fieldName === 'frequência_handoff') {
        if (phase === 'clearance' || phase === 'pushback') return 'ground';
        if (phase === 'taxi_pre') return 'tower';
    }
    if (fieldName === 'frequência') return 'departure';
    return undefined;
}

/**
 * Renders a phraseology template by replacing field segments with actual values.
 *
 * Resolution priority for 'field' segments:
 * 1. If field name is 'callsign', use the callsign parameter
 * 2. If field name matches an ATIS field, use the ATIS value
 * 3. If field name matches a frequency field, use the frequency value
 * 4. If field name exists in fieldValues, use that value
 * 5. Otherwise, use empty string
 */
export function renderTemplate(
    template: PhraseologyTemplate,
    fieldValues: Record<string, string>,
    atis: ATISConfig,
    callsign: string,
    frequencies?: FrequencyConfig,
): string {
    return template.segments
        .map(segment => {
            if (segment.type === 'text') {
                return segment.value;
            }

            const fieldName = segment.value;

            // Priority 1: callsign
            if (fieldName === 'callsign') {
                return callsign;
            }

            // Priority 2: ATIS fields
            const atisKey = ATIS_FIELD_MAP[fieldName];
            if (atisKey !== undefined) {
                return atis[atisKey];
            }

            // Priority 3: Frequency fields
            if (frequencies) {
                const freqKey = resolveFreqKey(fieldName, template.phase);
                if (freqKey !== undefined && frequencies[freqKey]) {
                    return frequencies[freqKey];
                }
            }

            // Priority 4: fieldValues
            if (fieldName in fieldValues) {
                return fieldValues[fieldName];
            }

            // Priority 5: empty string
            return '';
        })
        .join('');
}
