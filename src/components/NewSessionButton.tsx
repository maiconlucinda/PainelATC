import { useSession } from '../state/SessionContext';
import { clearSavedSession } from '../utils/persistence';

export function NewSessionButton() {
    const { dispatch } = useSession();

    function handleClick() {
        const confirmed = window.confirm(
            'Tem certeza que deseja iniciar uma nova sessão? Todos os dados serão perdidos.'
        );
        if (!confirmed) return;

        dispatch({ type: 'CLEAR_SESSION' });
        clearSavedSession();
    }

    return (
        <button
            onClick={handleClick}
            style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.87)',
                cursor: 'pointer',
            }}
        >
            Nova Sessão
        </button>
    );
}
