import type { ATCPosition, ControlPhase } from '../types';
import { PHASE_VISIBILITY } from '../types';

export function getVisiblePhases(position: ATCPosition): ControlPhase[] {
    return PHASE_VISIBILITY[position];
}

export function getNextPhase(currentPhase: ControlPhase, position: ATCPosition): ControlPhase {
    const visible = getVisiblePhases(position);
    const index = visible.indexOf(currentPhase);
    if (index === -1 || index === visible.length - 1) {
        return currentPhase;
    }
    return visible[index + 1];
}

export function getPreviousPhase(currentPhase: ControlPhase, position: ATCPosition): ControlPhase {
    const visible = getVisiblePhases(position);
    const index = visible.indexOf(currentPhase);
    if (index <= 0) {
        return currentPhase;
    }
    return visible[index - 1];
}

export function getInitialPhase(position: ATCPosition): ControlPhase {
    return getVisiblePhases(position)[0];
}
