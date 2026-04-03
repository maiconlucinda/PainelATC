import type { SessionState, SessionAction, ControlPhase } from '../types';
import { INITIAL_STATE } from '../types';
import { getInitialPhase, getNextPhase, getPreviousPhase, getVisiblePhases } from '../utils/phases';
import { isCallsignUnique } from '../utils/validation';

export function createEmptyFieldValues(): Record<ControlPhase, Record<string, string>> {
    return {
        clearance: {},
        pushback: {},
        taxi_pre: {},
        takeoff: {},
        landing: {},
        taxi_post: {},
    };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
    switch (action.type) {
        case 'SET_POSITION': {
            const newPosition = action.payload;
            const visiblePhases = getVisiblePhases(newPosition);
            return {
                ...state,
                position: newPosition,
                aircraft: state.aircraft.map(ac => {
                    if (visiblePhases.includes(ac.currentPhase)) {
                        return ac;
                    }
                    return { ...ac, currentPhase: visiblePhases[0] };
                }),
            };
        }

        case 'START_SESSION':
            return { ...state, sessionStarted: true };

        case 'UPDATE_ATIS':
            return { ...state, atis: { ...state.atis, ...action.payload } };

        case 'UPDATE_FREQUENCIES':
            return { ...state, frequencies: { ...state.frequencies, ...action.payload } };

        case 'ADD_AIRCRAFT': {
            const callsign = action.payload.toUpperCase();
            if (!isCallsignUnique(callsign, state.aircraft)) {
                return state;
            }
            const newAircraft = {
                callsign,
                language: 'PT' as const,
                currentPhase: getInitialPhase(state.position),
                fieldValues: createEmptyFieldValues(),
            };
            return {
                ...state,
                aircraft: [...state.aircraft, newAircraft],
                selectedAircraftCallsign: callsign,
            };
        }

        case 'REMOVE_AIRCRAFT': {
            const filtered = state.aircraft.filter(ac => ac.callsign !== action.payload);
            return {
                ...state,
                aircraft: filtered,
                selectedAircraftCallsign:
                    state.selectedAircraftCallsign === action.payload
                        ? null
                        : state.selectedAircraftCallsign,
            };
        }

        case 'SELECT_AIRCRAFT':
            return { ...state, selectedAircraftCallsign: action.payload };

        case 'ADVANCE_PHASE':
            return {
                ...state,
                aircraft: state.aircraft.map(ac =>
                    ac.callsign === action.payload
                        ? { ...ac, currentPhase: getNextPhase(ac.currentPhase, state.position) }
                        : ac
                ),
            };

        case 'RETREAT_PHASE':
            return {
                ...state,
                aircraft: state.aircraft.map(ac =>
                    ac.callsign === action.payload
                        ? { ...ac, currentPhase: getPreviousPhase(ac.currentPhase, state.position) }
                        : ac
                ),
            };

        case 'TOGGLE_LANGUAGE':
            return {
                ...state,
                aircraft: state.aircraft.map(ac =>
                    ac.callsign === action.payload
                        ? { ...ac, language: ac.language === 'PT' ? 'EN' : 'PT' }
                        : ac
                ),
            };

        case 'UPDATE_FIELD': {
            const { callsign, phase, fieldName, value } = action.payload;
            return {
                ...state,
                aircraft: state.aircraft.map(ac =>
                    ac.callsign === callsign
                        ? {
                            ...ac,
                            fieldValues: {
                                ...ac.fieldValues,
                                [phase]: {
                                    ...ac.fieldValues[phase],
                                    [fieldName]: value,
                                },
                            },
                        }
                        : ac
                ),
            };
        }

        case 'ADD_RUNWAY': {
            const newRunway = {
                id: typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now().toString(),
                identifier: action.payload,
                isActive: state.runways.length === 0,
            };
            return { ...state, runways: [...state.runways, newRunway] };
        }

        case 'REMOVE_RUNWAY': {
            const filtered = state.runways.filter(r => r.id !== action.payload);
            const removedWasActive = state.runways.find(r => r.id === action.payload)?.isActive;
            return {
                ...state,
                runways: removedWasActive
                    ? filtered.map(r => ({ ...r, isActive: false }))
                    : filtered,
            };
        }

        case 'SET_ACTIVE_RUNWAY':
            return {
                ...state,
                runways: state.runways.map(r => ({
                    ...r,
                    isActive: r.id === action.payload,
                })),
            };

        case 'RESTORE_SESSION':
            return action.payload;

        case 'CLEAR_SESSION':
            return INITIAL_STATE;

        default:
            return state;
    }
}
