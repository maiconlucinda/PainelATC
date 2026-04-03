import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SessionProvider } from './state/SessionContext'
import App from './App'

vi.mock('./utils/persistence', () => ({
    saveSession: vi.fn(),
    loadSession: vi.fn(() => null),
    clearSavedSession: vi.fn(),
    isLocalStorageAvailable: vi.fn(() => false),
}))

function renderApp() {
    return render(
        <SessionProvider>
            <App />
        </SessionProvider>
    )
}

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the position selector when session has not started', () => {
        renderApp()
        expect(screen.getByText('Painel ATC')).toBeInTheDocument()
        expect(screen.getByText('Iniciar Sessão')).toBeInTheDocument()
    })

    it('renders position options in the selector', () => {
        renderApp()
        expect(screen.getByText('Clearance Delivery (DEL)')).toBeInTheDocument()
        expect(screen.getByText('Torre Combinada')).toBeInTheDocument()
    })
})
