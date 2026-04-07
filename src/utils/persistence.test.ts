import { describe, it, expect, beforeEach } from 'vitest';
import { isLocalStorageAvailable, saveSession, loadSession, clearSavedSession } from './persistence';
import { INITIAL_STATE } from '../types';
import type { SessionState } from '../types';

const STORAGE_KEY = 'ivao-atc-session';

const sampleState: SessionState = {
    ...INITIAL_STATE,
    sessionStarted: true,
    position: 'TWR',
    aircraft: [
        {
            callsign: 'TAM123',
            language: 'PT',
            currentPhase: 'takeoff',
            fieldValues: {
                clearance: {},
                pushback: {},
                taxi_pre: {},
                takeoff: { destino: 'SBGR' },
                landing: {},
                taxi_post: {},
            },
            notes: '',
        },
    ],
};

beforeEach(() => {
    localStorage.clear();
});

describe('isLocalStorageAvailable', () => {
    it('returns true when localStorage works', () => {
        expect(isLocalStorageAvailable()).toBe(true);
    });

    it('returns false when localStorage throws', () => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = () => { throw new Error('blocked'); };
        expect(isLocalStorageAvailable()).toBe(false);
        Storage.prototype.setItem = original;
    });
});

describe('saveSession', () => {
    it('saves state as JSON to localStorage', () => {
        saveSession(sampleState);
        const raw = localStorage.getItem(STORAGE_KEY);
        expect(raw).not.toBeNull();
        expect(JSON.parse(raw!)).toEqual(sampleState);
    });

    it('silently ignores QuotaExceededError', () => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = () => {
            const err = new DOMException('quota exceeded', 'QuotaExceededError');
            throw err;
        };
        expect(() => saveSession(sampleState)).not.toThrow();
        Storage.prototype.setItem = original;
    });
});

describe('loadSession', () => {
    it('returns null when no session is saved', () => {
        expect(loadSession()).toBeNull();
    });

    it('loads and parses saved session', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState));
        expect(loadSession()).toEqual(sampleState);
    });

    it('returns null for corrupted JSON', () => {
        localStorage.setItem(STORAGE_KEY, '{invalid json!!!');
        expect(loadSession()).toBeNull();
    });
});

describe('clearSavedSession', () => {
    it('removes saved session from localStorage', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState));
        clearSavedSession();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('does not throw when no session exists', () => {
        expect(() => clearSavedSession()).not.toThrow();
    });

    it('silently ignores errors', () => {
        const original = Storage.prototype.removeItem;
        Storage.prototype.removeItem = () => { throw new Error('blocked'); };
        expect(() => clearSavedSession()).not.toThrow();
        Storage.prototype.removeItem = original;
    });
});
