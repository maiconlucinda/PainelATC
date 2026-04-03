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
    return (
        <input
            className={styles.field}
            type="text"
            value={value}
            placeholder={fieldName}
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
