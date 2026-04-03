import { describe, it, expect } from 'vitest';
import { renderTemplate } from './templates';
import type { PhraseologyTemplate, ATISConfig } from '../types';

const defaultATIS: ATISConfig = {
    letter: 'A',
    runway: '10',
    windDirection: '090',
    windSpeed: '8',
    qnh: '1013',
    visibility: '9999',
};

const emptyATIS: ATISConfig = {
    letter: '',
    runway: '',
    windDirection: '',
    windSpeed: '',
    qnh: '',
    visibility: '',
};

describe('renderTemplate', () => {
    it('renders text-only segments as-is', () => {
        const template: PhraseologyTemplate = {
            id: 'test-1',
            phase: 'clearance',
            language: 'PT',
            segments: [
                { type: 'text', value: 'Torre, prossiga' },
            ],
        };
        expect(renderTemplate(template, {}, emptyATIS, 'TAM123')).toBe('Torre, prossiga');
    });

    it('replaces callsign field with the callsign parameter', () => {
        const template: PhraseologyTemplate = {
            id: 'test-2',
            phase: 'clearance',
            language: 'PT',
            segments: [
                { type: 'field', value: 'callsign' },
                { type: 'text', value: ', Torre, prossiga' },
            ],
        };
        expect(renderTemplate(template, {}, emptyATIS, 'GLO456')).toBe('GLO456, Torre, prossiga');
    });

    it('replaces ATIS fields with ATIS values (PT names)', () => {
        const template: PhraseologyTemplate = {
            id: 'test-3',
            phase: 'takeoff',
            language: 'PT',
            segments: [
                { type: 'field', value: 'callsign' },
                { type: 'text', value: ', pista ' },
                { type: 'field', value: 'pista' },
                { type: 'text', value: ', vento ' },
                { type: 'field', value: 'direção' },
                { type: 'text', value: ' graus ' },
                { type: 'field', value: 'velocidade' },
                { type: 'text', value: ' nós' },
            ],
        };
        const result = renderTemplate(template, {}, defaultATIS, 'AZU789');
        expect(result).toBe('AZU789, pista 10, vento 090 graus 8 nós');
    });

    it('replaces ATIS fields with ATIS values (EN names)', () => {
        const template: PhraseologyTemplate = {
            id: 'test-4',
            phase: 'takeoff',
            language: 'EN',
            segments: [
                { type: 'field', value: 'callsign' },
                { type: 'text', value: ', runway ' },
                { type: 'field', value: 'runway' },
                { type: 'text', value: ', wind ' },
                { type: 'field', value: 'direction' },
                { type: 'text', value: ' degrees ' },
                { type: 'field', value: 'speed' },
                { type: 'text', value: ' knots' },
            ],
        };
        const result = renderTemplate(template, {}, defaultATIS, 'AZU789');
        expect(result).toBe('AZU789, runway 10, wind 090 degrees 8 knots');
    });

    it('replaces letra_ATIS and QNH fields', () => {
        const template: PhraseologyTemplate = {
            id: 'test-5',
            phase: 'clearance',
            language: 'PT',
            segments: [
                { type: 'text', value: 'ATIS ' },
                { type: 'field', value: 'letra_ATIS' },
                { type: 'text', value: ', QNH ' },
                { type: 'field', value: 'QNH' },
            ],
        };
        const result = renderTemplate(template, {}, defaultATIS, 'TAM');
        expect(result).toBe('ATIS A, QNH 1013');
    });

    it('uses fieldValues for non-ATIS, non-callsign fields', () => {
        const template: PhraseologyTemplate = {
            id: 'test-6',
            phase: 'clearance',
            language: 'PT',
            segments: [
                { type: 'field', value: 'callsign' },
                { type: 'text', value: ', autorizado ' },
                { type: 'field', value: 'destino' },
                { type: 'text', value: ', via ' },
                { type: 'field', value: 'SID/rota' },
            ],
        };
        const fieldValues = { destino: 'SBGR', 'SID/rota': 'CELSO1A' };
        const result = renderTemplate(template, fieldValues, emptyATIS, 'TAM123');
        expect(result).toBe('TAM123, autorizado SBGR, via CELSO1A');
    });

    it('returns empty string for unknown fields without fieldValues', () => {
        const template: PhraseologyTemplate = {
            id: 'test-7',
            phase: 'clearance',
            language: 'PT',
            segments: [
                { type: 'field', value: 'callsign' },
                { type: 'text', value: ', squawk ' },
                { type: 'field', value: 'código transponder' },
            ],
        };
        const result = renderTemplate(template, {}, emptyATIS, 'TAM123');
        expect(result).toBe('TAM123, squawk ');
    });

    it('prioritizes callsign over fieldValues', () => {
        const template: PhraseologyTemplate = {
            id: 'test-8',
            phase: 'clearance',
            language: 'PT',
            segments: [{ type: 'field', value: 'callsign' }],
        };
        const fieldValues = { callsign: 'WRONG' };
        expect(renderTemplate(template, fieldValues, emptyATIS, 'CORRECT')).toBe('CORRECT');
    });

    it('prioritizes ATIS values over fieldValues', () => {
        const template: PhraseologyTemplate = {
            id: 'test-9',
            phase: 'clearance',
            language: 'PT',
            segments: [{ type: 'field', value: 'pista' }],
        };
        const fieldValues = { pista: 'WRONG' };
        expect(renderTemplate(template, fieldValues, defaultATIS, 'TAM')).toBe('10');
    });
});
