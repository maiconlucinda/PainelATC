import type { ControlPhase, SessionAction } from '../types';
import styles from './EditableField.module.css';
import type { Dispatch } from 'react';

interface EditableFieldProps {
    fieldName: string;
    value: string;
    callsign: string;
    phase: ControlPhase;
    dispatch: Dispatch<SessionAction>;
}

export function EditableField({ fieldName, value, callsign, phase, dispatch }: EditableFieldProps) {
    const displayLength = Math.max(value.length, fieldName.length, 4);
    return (
        <input
            className={styles.field}
            type="text"
            value={value}
            placeholder={fieldName}
            size={displayLength + 1}
            onChange={(e) =>
                dispatch({
                    type: 'UPDATE_FIELD',
                    payload: { callsign, phase, fieldName, value: e.target.value },
                })
            }
            aria-label={fieldName}
        />
    );
}
