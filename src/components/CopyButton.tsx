import { useState, useCallback } from 'react';
import type { PhraseologyTemplate, ATISConfig, FrequencyConfig } from '../types';
import { renderTemplate } from '../utils/templates';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
    template: PhraseologyTemplate;
    fieldValues: Record<string, string>;
    atis: ATISConfig;
    callsign: string;
    frequencies?: FrequencyConfig;
}

export function CopyButton({ template, fieldValues, atis, callsign, frequencies }: CopyButtonProps) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const handleCopy = useCallback(async () => {
        const text = renderTemplate(template, fieldValues, atis, callsign, frequencies);

        if (!navigator.clipboard?.writeText) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2500);
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setStatus('copied');
            setTimeout(() => setStatus('idle'), 1500);
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2500);
        }
    }, [template, fieldValues, atis, callsign]);

    return (
        <span className={styles.wrapper}>
            <button className={styles.btn} onClick={handleCopy} title="Copiar fraseologia">
                📋
            </button>
            {status === 'copied' && <span className={styles.confirmation}>Copiado!</span>}
            {status === 'error' && <span className={styles.error}>Copie manualmente</span>}
        </span>
    );
}
