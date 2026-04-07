import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionRestoreDialog } from './SessionRestoreDialog';
import { SessionProvider, useSession } from '../state/SessionContext';
import { INITIAL_STATE } from '../types';
import type { SessionState } from '../types';

vi.mock('../utils/persistence', () => ({
    saveSession: vi.fn(),
    loadSession: vi.fn(() => null),
    clearSavedSession: vi.fn(),
}));

import { clearSavedSession } from '../utils/persistence';
const mockedClearSavedSession = vi.mocked(clearSavedSession);

const savedState: SessionState = {
    ...INITIAL_STATE,
    sessionStarted: true,
    position: 'TWR',
    aircraft: [
        {
            callsign: 'TAM123',
            language: 'PT',
            currentPhase: 'takeoff',
            fieldValues: { clearance: {}, pushback: {}, taxi_pre: {}, takeoff: {}, landing: {}, taxi_post: {} },
            notes: '',
        },
        {
            callsign: 'GLO456',
            language: 'EN',
            currentPhase: 'landing',
            fieldValues: { clearance: {}, pushback: {}, taxi_pre: {}, takeoff: {}, landing: {}, taxi_post: {} },
            notes: '',
        },
    ],
};

function StateInspector() {
    const { state } = useSession();
    return (
        <div>
            <span data-testid="position">{state.position}</span>
            <span data-testid="started">{String(state.sessionStarted)}</span>
            <span data-testid="aircraft-count">{state.aircraft.length}</span>
        </div>
    );
}

describe('SessionRestoreDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders dialog with session summary', () => {
        render(
            <SessionProvider>
                <SessionRestoreDialog savedSession={savedState} />
            </SessionProvider>
        );

        expect(screen.getByText('Sessão anterior encontrada')).toBeInTheDocument();
        expect(screen.getByText(/Torre/)).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Continuar Sessão')).toBeInTheDocument();
        expect(screen.getByText('Nova Sessão')).toBeInTheDocument();
    });

    it('shows correct position label for DEL', () => {
        const delSession = { ...savedState, position: 'DEL' as const };
        render(
            <SessionProvider>
                <SessionRestoreDialog savedSession={delSession} />
            </SessionProvider>
        );
        expect(screen.getByText(/Clearance Delivery/)).toBeInTheDocument();
    });

    it('shows correct position label for GND', () => {
        const gndSession = { ...savedState, position: 'GND' as const };
        render(
            <SessionProvider>
                <SessionRestoreDialog savedSession={gndSession} />
            </SessionProvider>
        );
        expect(screen.getByText(/Ground \/ Solo/)).toBeInTheDocument();
    });

    it('shows correct position label for TWR_COMBINED', () => {
        const combinedSession = { ...savedState, position: 'TWR_COMBINED' as const };
        render(
            <SessionProvider>
                <SessionRestoreDialog savedSession={combinedSession} />
            </SessionProvider>
        );
        expect(screen.getByText(/Torre Combinada/)).toBeInTheDocument();
    });

    it('dispatches RESTORE_SESSION when "Continuar Sessão" is clicked', () => {
        render(
            <SessionProvider>
                <SessionRestoreDialog savedSession={savedState} />
                <StateInspector />
            </SessionProvider>
        );

        act(() => {
            screen.getByText('Continuar Sessão').click();
        });

        expect(screen.getByTestId('position').textContent).toBe('TWR');
        expect(screen.getByTestId('started').textContent).toBe('true');
        expect(screen.getByTestId('aircraft-count').textContent).toBe('2');
    });

    it('dispatches CLEAR_SESSION and calls clearSavedSession when "Nova Sessão" is clicked', () => {
        render(
            <SessionProvider>
                <SessionRestoreDialog savedSession={savedState} />
                <StateInspector />
            </SessionProvider>
        );

        act(() => {
            screen.getByText('Nova Sessão').click();
        });

        expect(screen.getByTestId('started').textContent).toBe('false');
        expect(screen.getByTestId('aircraft-count').textContent).toBe('0');
        expect(mockedClearSavedSession).toHaveBeenCalled();
    });

    it('has dialog role for accessibility', () => {
        render(
            <SessionProvider>
                <SessionRestoreDialog savedSession={savedState} />
            </SessionProvider>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});
