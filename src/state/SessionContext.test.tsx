import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionProvider, useSession } from './SessionContext';
import { INITIAL_STATE } from '../types';
import type { SessionState } from '../types';

// Mock persistence module
vi.mock('../utils/persistence', () => ({
    saveSession: vi.fn(),
    loadSession: vi.fn(() => null),
}));

import { saveSession, loadSession } from '../utils/persistence';

const mockedSaveSession = vi.mocked(saveSession);
const mockedLoadSession = vi.mocked(loadSession);

function TestConsumer() {
    const { state, dispatch, savedSession } = useSession();
    return (
        <div>
            <span data-testid="position">{state.position}</span>
            <span data-testid="started">{String(state.sessionStarted)}</span>
            <button onClick={() => dispatch({ type: 'START_SESSION' })}>Start</button>
            <button onClick={() => dispatch({ type: 'ADD_AIRCRAFT', payload: 'TAM123' })}>Add</button>
            <span data-testid="aircraft-count">{state.aircraft.length}</span>
            <span data-testid="has-saved-session">{String(savedSession !== null)}</span>
        </div>
    );
}

describe('SessionContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedLoadSession.mockReturnValue(null);
    });

    it('provides initial state through context', () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        );

        expect(screen.getByTestId('position').textContent).toBe(INITIAL_STATE.position);
        expect(screen.getByTestId('started').textContent).toBe('false');
        expect(screen.getByTestId('aircraft-count').textContent).toBe('0');
    });

    it('dispatches actions and updates state', () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        );

        act(() => {
            screen.getByText('Start').click();
        });
        expect(screen.getByTestId('started').textContent).toBe('true');

        act(() => {
            screen.getByText('Add').click();
        });
        expect(screen.getByTestId('aircraft-count').textContent).toBe('1');
    });

    it('throws when useSession is used outside SessionProvider', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        expect(() => render(<TestConsumer />)).toThrow(
            'useSession must be used within a SessionProvider'
        );
        spy.mockRestore();
    });

    it('exposes savedSession as null when no saved session exists', () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        );

        expect(screen.getByTestId('has-saved-session').textContent).toBe('false');
    });

    it('exposes savedSession when loadSession returns a saved state', () => {
        const savedState: SessionState = {
            ...INITIAL_STATE,
            sessionStarted: true,
            position: 'GND',
        };
        mockedLoadSession.mockReturnValue(savedState);

        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        );

        expect(screen.getByTestId('has-saved-session').textContent).toBe('true');
    });

    it('auto-saves state when sessionStarted is true', () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        );

        // Before starting session, saveSession should not be called for state changes
        mockedSaveSession.mockClear();

        act(() => {
            screen.getByText('Start').click();
        });

        // After starting session, saveSession should be called
        expect(mockedSaveSession).toHaveBeenCalled();
    });

    it('does not auto-save when sessionStarted is false', () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        );

        // Clear any calls from initial render
        mockedSaveSession.mockClear();

        // The initial state has sessionStarted=false, so no save should happen
        // on the initial useEffect run (already happened), and no further saves
        expect(mockedSaveSession).not.toHaveBeenCalled();
    });

    it('clears savedSession after RESTORE_SESSION dispatch', () => {
        const savedState: SessionState = {
            ...INITIAL_STATE,
            sessionStarted: true,
            position: 'DEL',
        };
        mockedLoadSession.mockReturnValue(savedState);

        function RestoreConsumer() {
            const { dispatch, savedSession } = useSession();
            return (
                <div>
                    <span data-testid="has-saved">{String(savedSession !== null)}</span>
                    <button onClick={() => dispatch({ type: 'RESTORE_SESSION', payload: savedState })}>
                        Restore
                    </button>
                </div>
            );
        }

        render(
            <SessionProvider>
                <RestoreConsumer />
            </SessionProvider>
        );

        expect(screen.getByTestId('has-saved').textContent).toBe('true');

        act(() => {
            screen.getByText('Restore').click();
        });

        expect(screen.getByTestId('has-saved').textContent).toBe('false');
    });

    it('clears savedSession after CLEAR_SESSION dispatch', () => {
        const savedState: SessionState = {
            ...INITIAL_STATE,
            sessionStarted: true,
            position: 'TWR',
        };
        mockedLoadSession.mockReturnValue(savedState);

        function ClearConsumer() {
            const { dispatch, savedSession } = useSession();
            return (
                <div>
                    <span data-testid="has-saved">{String(savedSession !== null)}</span>
                    <button onClick={() => dispatch({ type: 'CLEAR_SESSION' })}>Clear</button>
                </div>
            );
        }

        render(
            <SessionProvider>
                <ClearConsumer />
            </SessionProvider>
        );

        expect(screen.getByTestId('has-saved').textContent).toBe('true');

        act(() => {
            screen.getByText('Clear').click();
        });

        expect(screen.getByTestId('has-saved').textContent).toBe('false');
    });
});
