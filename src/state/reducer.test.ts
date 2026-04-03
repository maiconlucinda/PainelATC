import { describe, it, expect } from 'vitest';
import { sessionReducer, createEmptyFieldValues } from './reducer';
import { INITIAL_STATE } from '../types';
import type { SessionState } from '../types';

function stateWith(overrides: Partial<SessionState>): SessionState {
    return { ...INITIAL_STATE, ...overrides };
}

describe('sessionReducer', () => {
    describe('SET_POSITION', () => {
        it('updates position', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'SET_POSITION', payload: 'DEL' });
            expect(result.position).toBe('DEL');
        });

        it('moves aircraft to first visible phase when current phase is not visible', () => {
            const state = stateWith({
                position: 'TWR_COMBINED',
                aircraft: [{
                    callsign: 'TAM1',
                    language: 'PT',
                    currentPhase: 'takeoff',
                    fieldValues: createEmptyFieldValues(),
                }],
            });
            const result = sessionReducer(state, { type: 'SET_POSITION', payload: 'GND' });
            expect(result.aircraft[0].currentPhase).toBe('pushback');
        });

        it('keeps aircraft phase when it is visible in new position', () => {
            const state = stateWith({
                position: 'TWR_COMBINED',
                aircraft: [{
                    callsign: 'TAM1',
                    language: 'PT',
                    currentPhase: 'clearance',
                    fieldValues: createEmptyFieldValues(),
                }],
            });
            const result = sessionReducer(state, { type: 'SET_POSITION', payload: 'DEL' });
            expect(result.aircraft[0].currentPhase).toBe('clearance');
        });

        it('preserves fieldValues when changing position', () => {
            const fv = createEmptyFieldValues();
            fv.clearance = { destino: 'SBGR' };
            const state = stateWith({
                position: 'TWR_COMBINED',
                aircraft: [{
                    callsign: 'TAM1',
                    language: 'PT',
                    currentPhase: 'clearance',
                    fieldValues: fv,
                }],
            });
            const result = sessionReducer(state, { type: 'SET_POSITION', payload: 'DEL' });
            expect(result.aircraft[0].fieldValues.clearance.destino).toBe('SBGR');
        });
    });

    describe('START_SESSION', () => {
        it('sets sessionStarted to true', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'START_SESSION' });
            expect(result.sessionStarted).toBe(true);
        });
    });

    describe('UPDATE_ATIS', () => {
        it('merges partial ATIS into current', () => {
            const result = sessionReducer(INITIAL_STATE, {
                type: 'UPDATE_ATIS',
                payload: { letter: 'A', qnh: '1013' },
            });
            expect(result.atis.letter).toBe('A');
            expect(result.atis.qnh).toBe('1013');
            expect(result.atis.runway).toBe('');
        });
    });

    describe('ADD_AIRCRAFT', () => {
        it('adds aircraft with uppercased callsign, PT language, and initial phase', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'tam1' });
            expect(result.aircraft).toHaveLength(1);
            expect(result.aircraft[0].callsign).toBe('TAM1');
            expect(result.aircraft[0].language).toBe('PT');
            expect(result.aircraft[0].currentPhase).toBe('clearance');
        });

        it('auto-selects the new aircraft', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            expect(result.selectedAircraftCallsign).toBe('TAM1');
        });

        it('rejects duplicate callsign (case-insensitive)', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'ADD_AIRCRAFT', payload: 'tam1' });
            expect(state.aircraft).toHaveLength(1);
        });

        it('initializes empty fieldValues for all phases', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            const fv = result.aircraft[0].fieldValues;
            expect(Object.keys(fv)).toHaveLength(6);
            expect(fv.clearance).toEqual({});
            expect(fv.taxi_post).toEqual({});
        });

        it('uses initial phase based on current position', () => {
            const state = stateWith({ position: 'GND' });
            const result = sessionReducer(state, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            expect(result.aircraft[0].currentPhase).toBe('pushback');
        });
    });

    describe('REMOVE_AIRCRAFT', () => {
        it('removes aircraft by callsign', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'REMOVE_AIRCRAFT', payload: 'TAM1' });
            expect(state.aircraft).toHaveLength(0);
        });

        it('clears selection if removed aircraft was selected', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            expect(state.selectedAircraftCallsign).toBe('TAM1');
            state = sessionReducer(state, { type: 'REMOVE_AIRCRAFT', payload: 'TAM1' });
            expect(state.selectedAircraftCallsign).toBeNull();
        });

        it('keeps selection if a different aircraft was removed', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'ADD_AIRCRAFT', payload: 'GLO2' });
            state = sessionReducer(state, { type: 'SELECT_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'REMOVE_AIRCRAFT', payload: 'GLO2' });
            expect(state.selectedAircraftCallsign).toBe('TAM1');
        });
    });

    describe('SELECT_AIRCRAFT', () => {
        it('sets selectedAircraftCallsign', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'SELECT_AIRCRAFT', payload: 'TAM1' });
            expect(result.selectedAircraftCallsign).toBe('TAM1');
        });

        it('can set to null', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'SELECT_AIRCRAFT', payload: null });
            expect(result.selectedAircraftCallsign).toBeNull();
        });
    });

    describe('ADVANCE_PHASE', () => {
        it('advances to next visible phase', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'ADVANCE_PHASE', payload: 'TAM1' });
            expect(state.aircraft[0].currentPhase).toBe('pushback');
        });

        it('stays at last phase', () => {
            const state = stateWith({
                position: 'DEL',
                aircraft: [{
                    callsign: 'TAM1',
                    language: 'PT',
                    currentPhase: 'clearance',
                    fieldValues: createEmptyFieldValues(),
                }],
            });
            const result = sessionReducer(state, { type: 'ADVANCE_PHASE', payload: 'TAM1' });
            expect(result.aircraft[0].currentPhase).toBe('clearance');
        });
    });

    describe('RETREAT_PHASE', () => {
        it('retreats to previous visible phase', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'ADVANCE_PHASE', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'RETREAT_PHASE', payload: 'TAM1' });
            expect(state.aircraft[0].currentPhase).toBe('clearance');
        });

        it('stays at first phase', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'RETREAT_PHASE', payload: 'TAM1' });
            expect(state.aircraft[0].currentPhase).toBe('clearance');
        });
    });

    describe('TOGGLE_LANGUAGE', () => {
        it('toggles PT to EN', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'TOGGLE_LANGUAGE', payload: 'TAM1' });
            expect(state.aircraft[0].language).toBe('EN');
        });

        it('toggles EN back to PT', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'TOGGLE_LANGUAGE', payload: 'TAM1' });
            state = sessionReducer(state, { type: 'TOGGLE_LANGUAGE', payload: 'TAM1' });
            expect(state.aircraft[0].language).toBe('PT');
        });

        it('preserves fieldValues', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, {
                type: 'UPDATE_FIELD',
                payload: { callsign: 'TAM1', phase: 'clearance', fieldName: 'destino', value: 'SBGR' },
            });
            state = sessionReducer(state, { type: 'TOGGLE_LANGUAGE', payload: 'TAM1' });
            expect(state.aircraft[0].fieldValues.clearance.destino).toBe('SBGR');
        });
    });

    describe('UPDATE_FIELD', () => {
        it('updates field value for specific aircraft, phase, and field', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_AIRCRAFT', payload: 'TAM1' });
            state = sessionReducer(state, {
                type: 'UPDATE_FIELD',
                payload: { callsign: 'TAM1', phase: 'clearance', fieldName: 'destino', value: 'SBGR' },
            });
            expect(state.aircraft[0].fieldValues.clearance.destino).toBe('SBGR');
        });
    });

    describe('ADD_RUNWAY', () => {
        it('adds a runway', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'ADD_RUNWAY', payload: '10' });
            expect(result.runways).toHaveLength(1);
            expect(result.runways[0].identifier).toBe('10');
        });

        it('first runway is active', () => {
            const result = sessionReducer(INITIAL_STATE, { type: 'ADD_RUNWAY', payload: '10' });
            expect(result.runways[0].isActive).toBe(true);
        });

        it('subsequent runways are not active', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_RUNWAY', payload: '10' });
            state = sessionReducer(state, { type: 'ADD_RUNWAY', payload: '28' });
            expect(state.runways[1].isActive).toBe(false);
        });
    });

    describe('REMOVE_RUNWAY', () => {
        it('removes runway by id', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_RUNWAY', payload: '10' });
            const id = state.runways[0].id;
            state = sessionReducer(state, { type: 'REMOVE_RUNWAY', payload: id });
            expect(state.runways).toHaveLength(0);
        });

        it('deactivates all if active runway removed', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_RUNWAY', payload: '10' });
            state = sessionReducer(state, { type: 'ADD_RUNWAY', payload: '28' });
            const activeId = state.runways[0].id;
            state = sessionReducer(state, { type: 'REMOVE_RUNWAY', payload: activeId });
            expect(state.runways.every(r => !r.isActive)).toBe(true);
        });
    });

    describe('SET_ACTIVE_RUNWAY', () => {
        it('sets the specified runway as active and others as inactive', () => {
            let state = sessionReducer(INITIAL_STATE, { type: 'ADD_RUNWAY', payload: '10' });
            state = sessionReducer(state, { type: 'ADD_RUNWAY', payload: '28' });
            const secondId = state.runways[1].id;
            state = sessionReducer(state, { type: 'SET_ACTIVE_RUNWAY', payload: secondId });
            expect(state.runways[0].isActive).toBe(false);
            expect(state.runways[1].isActive).toBe(true);
        });
    });

    describe('RESTORE_SESSION', () => {
        it('replaces entire state with payload', () => {
            const saved: SessionState = {
                ...INITIAL_STATE,
                position: 'DEL',
                sessionStarted: true,
                aircraft: [{
                    callsign: 'TAM1',
                    language: 'EN',
                    currentPhase: 'clearance',
                    fieldValues: createEmptyFieldValues(),
                }],
            };
            const result = sessionReducer(INITIAL_STATE, { type: 'RESTORE_SESSION', payload: saved });
            expect(result).toEqual(saved);
        });
    });

    describe('CLEAR_SESSION', () => {
        it('returns INITIAL_STATE', () => {
            const state = stateWith({ position: 'DEL', sessionStarted: true });
            const result = sessionReducer(state, { type: 'CLEAR_SESSION' });
            expect(result).toEqual(INITIAL_STATE);
        });
    });
});

describe('createEmptyFieldValues', () => {
    it('returns empty records for all 6 phases', () => {
        const fv = createEmptyFieldValues();
        expect(Object.keys(fv)).toEqual([
            'clearance', 'pushback', 'taxi_pre', 'takeoff', 'landing', 'taxi_post',
        ]);
        for (const phase of Object.values(fv)) {
            expect(phase).toEqual({});
        }
    });
});
