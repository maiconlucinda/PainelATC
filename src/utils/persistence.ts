import type { SessionState } from '../types';

const STORAGE_KEY = 'ivao-atc-session';

/**
 * Verifica se localStorage está disponível no navegador.
 * Testa com setItem/removeItem para cobrir navegação privada e restrições.
 */
export function isLocalStorageAvailable(): boolean {
    try {
        const testKey = '__ls_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

/**
 * Salva o estado da sessão no localStorage como JSON.
 * Ignora silenciosamente QuotaExceededError e outros erros.
 */
export function saveSession(state: SessionState): void {
    if (!isLocalStorageAvailable()) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Quota excedida ou outro erro — ignora silenciosamente
    }
}

/**
 * Carrega e parseia o estado da sessão do localStorage.
 * Retorna null se não encontrado ou se os dados estiverem corrompidos.
 */
export function loadSession(): SessionState | null {
    if (!isLocalStorageAvailable()) return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as SessionState;
    } catch {
        return null;
    }
}

/**
 * Remove a sessão salva do localStorage.
 * Ignora erros silenciosamente.
 */
export function clearSavedSession(): void {
    if (!isLocalStorageAvailable()) return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignora silenciosamente
    }
}
