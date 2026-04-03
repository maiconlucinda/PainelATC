import type { Aircraft } from '../types';

/**
 * Returns true if no aircraft in the array has the given callsign (case-insensitive).
 */
export function isCallsignUnique(callsign: string, aircraft: Aircraft[]): boolean {
    const normalized = callsign.toUpperCase();
    return !aircraft.some(a => a.callsign.toUpperCase() === normalized);
}
