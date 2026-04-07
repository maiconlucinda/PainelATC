import { describe, it, expect } from 'vitest';
import { isCallsignUnique } from './validation';
import type { Aircraft } from '../types';

const makeAircraft = (callsign: string): Aircraft => ({
    callsign,
    language: 'PT',
    currentPhase: 'clearance',
    fieldValues: {
        clearance: {},
        pushback: {},
        taxi_pre: {},
        takeoff: {},
        landing: {},
        taxi_post: {},
    },
    notes: '',
});

describe('isCallsignUnique', () => {
    it('returns true for empty aircraft list', () => {
        expect(isCallsignUnique('TAM123', [])).toBe(true);
    });

    it('returns true when callsign is not in the list', () => {
        const aircraft = [makeAircraft('GLO456'), makeAircraft('AZU789')];
        expect(isCallsignUnique('TAM123', aircraft)).toBe(true);
    });

    it('returns false when callsign exists (exact match)', () => {
        const aircraft = [makeAircraft('TAM123')];
        expect(isCallsignUnique('TAM123', aircraft)).toBe(false);
    });

    it('returns false when callsign exists (case-insensitive)', () => {
        const aircraft = [makeAircraft('TAM123')];
        expect(isCallsignUnique('tam123', aircraft)).toBe(false);
        expect(isCallsignUnique('Tam123', aircraft)).toBe(false);
    });
});
