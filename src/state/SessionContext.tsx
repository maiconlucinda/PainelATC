import { createContext, useContext, useReducer, useEffect, useState, useCallback, type ReactNode, type Dispatch } from 'react';
import type { SessionState, SessionAction } from '../types';
import { INITIAL_STATE } from '../types';
import { sessionReducer } from './reducer';
import { saveSession, loadSession } from '../utils/persistence';

interface SessionContextValue {
    state: SessionState;
    dispatch: Dispatch<SessionAction>;
    savedSession: SessionState | null;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [state, baseDispatch] = useReducer(sessionReducer, INITIAL_STATE);
    const [savedSession, setSavedSession] = useState<SessionState | null>(() => loadSession());

    const dispatch = useCallback((action: SessionAction) => {
        baseDispatch(action);
        if (action.type === 'RESTORE_SESSION' || action.type === 'CLEAR_SESSION') {
            setSavedSession(null);
        }
    }, []);

    // Auto-save state to localStorage whenever state changes and session is active
    useEffect(() => {
        if (state.sessionStarted) {
            saveSession(state);
        }
    }, [state]);

    return (
        <SessionContext.Provider value={{ state, dispatch, savedSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContextValue {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
