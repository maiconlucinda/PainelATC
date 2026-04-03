import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewSessionButton } from './NewSessionButton';
import { SessionProvider, useSession } from '../state/SessionContext';

vi.mock('../utils/persistence', () => ({
    saveSession: vi.fn(),
    loadSession: vi.fn(() => null),
    clearSavedSession: vi.fn(),
}));

import { clearSavedSession } from '../utils/persistence';
const mockedClearSavedSession = vi.mocked(clearSavedSession);

function StateInspector() {
    const { state, dispatch } = useSession();
    return (
        <div>
            <span data-testid="started">{String(state.sessionStarted)}</span>
            <span data-testid="aircraft-count">{state.aircraft.length}</span>
            <button data-testid="setup" onClick={() => {
                dispatch({ type: 'START_SESSION' });
                dispatch({ type: 'ADD_AIRCRAFT', payload: 'TAM123' });
            }}>Setup</button>
        </div>
    );
}

describe('NewSessionButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders button with "Nova Sessão" text', () => {
        render(
            <SessionProvider>
                <NewSessionButton />
            </SessionProvider>
        );
        expect(screen.getByText('Nova Sessão')).toBeInTheDocument();
    });

    it('shows confirmation dialog on click', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

        render(
            <SessionProvider>
                <NewSessionButton />
            </SessionProvider>
        );

        act(() => {
            screen.getByText('Nova Sessão').click();
        });

        expect(confirmSpy).toHaveBeenCalledWith(
            'Tem certeza que deseja iniciar uma nova sessão? Todos os dados serão perdidos.'
        );
        confirmSpy.mockRestore();
    });

    it('does nothing when confirmation is cancelled', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false);

        render(
            <SessionProvider>
                <NewSessionButton />
                <StateInspector />
            </SessionProvider>
        );

        // Setup an active session
        act(() => {
            screen.getByTestId('setup').click();
        });
        expect(screen.getByTestId('started').textContent).toBe('true');
        expect(screen.getByTestId('aircraft-count').textContent).toBe('1');

        // Click Nova Sessão but cancel
        act(() => {
            screen.getByText('Nova Sessão').click();
        });

        // State should remain unchanged
        expect(screen.getByTestId('started').textContent).toBe('true');
        expect(screen.getByTestId('aircraft-count').textContent).toBe('1');
        expect(mockedClearSavedSession).not.toHaveBeenCalled();

        vi.restoreAllMocks();
    });

    it('clears session when confirmation is accepted', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(
            <SessionProvider>
                <NewSessionButton />
                <StateInspector />
            </SessionProvider>
        );

        // Setup an active session
        act(() => {
            screen.getByTestId('setup').click();
        });
        expect(screen.getByTestId('started').textContent).toBe('true');

        // Click Nova Sessão and confirm
        act(() => {
            screen.getByText('Nova Sessão').click();
        });

        // State should be reset
        expect(screen.getByTestId('started').textContent).toBe('false');
        expect(screen.getByTestId('aircraft-count').textContent).toBe('0');
        expect(mockedClearSavedSession).toHaveBeenCalled();

        vi.restoreAllMocks();
    });
});
