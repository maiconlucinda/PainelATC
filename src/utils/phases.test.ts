import { describe, it, expect } from 'vitest';
import { getVisiblePhases, getNextPhase, getPreviousPhase, getInitialPhase } from './phases';

describe('getVisiblePhases', () => {
    it('returns only clearance for DEL', () => {
        expect(getVisiblePhases('DEL')).toEqual(['clearance']);
    });

    it('returns pushback and taxi_pre for GND', () => {
        expect(getVisiblePhases('GND')).toEqual(['pushback', 'taxi_pre']);
    });

    it('returns takeoff, landing, taxi_post for TWR', () => {
        expect(getVisiblePhases('TWR')).toEqual(['takeoff', 'landing', 'taxi_post']);
    });

    it('returns all phases for TWR_COMBINED', () => {
        expect(getVisiblePhases('TWR_COMBINED')).toEqual([
            'clearance', 'pushback', 'taxi_pre', 'takeoff', 'landing', 'taxi_post',
        ]);
    });
});

describe('getNextPhase', () => {
    it('advances to next visible phase', () => {
        expect(getNextPhase('clearance', 'TWR_COMBINED')).toBe('pushback');
    });

    it('stays at current phase when already at last', () => {
        expect(getNextPhase('taxi_post', 'TWR_COMBINED')).toBe('taxi_post');
        expect(getNextPhase('clearance', 'DEL')).toBe('clearance');
    });

    it('stays at current phase when phase not in visible list', () => {
        expect(getNextPhase('clearance', 'GND')).toBe('clearance');
    });
});

describe('getPreviousPhase', () => {
    it('retreats to previous visible phase', () => {
        expect(getPreviousPhase('pushback', 'TWR_COMBINED')).toBe('clearance');
    });

    it('stays at current phase when already at first', () => {
        expect(getPreviousPhase('clearance', 'TWR_COMBINED')).toBe('clearance');
        expect(getPreviousPhase('takeoff', 'TWR')).toBe('takeoff');
    });

    it('stays at current phase when phase not in visible list', () => {
        expect(getPreviousPhase('clearance', 'TWR')).toBe('clearance');
    });
});

describe('getInitialPhase', () => {
    it('returns clearance for DEL', () => {
        expect(getInitialPhase('DEL')).toBe('clearance');
    });

    it('returns pushback for GND', () => {
        expect(getInitialPhase('GND')).toBe('pushback');
    });

    it('returns takeoff for TWR', () => {
        expect(getInitialPhase('TWR')).toBe('takeoff');
    });

    it('returns clearance for TWR_COMBINED', () => {
        expect(getInitialPhase('TWR_COMBINED')).toBe('clearance');
    });
});
