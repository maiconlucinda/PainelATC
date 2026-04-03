import { describe, it, expect } from 'vitest';
import { TEMPLATES, getTemplates } from './phraseology';
import type { ControlPhase, Language } from '../types';
import { PHASE_ORDER } from '../types';

const LANGUAGES: Language[] = ['PT', 'EN'];

const EXPECTED_COUNTS: Record<ControlPhase, number> = {
    clearance: 6,
    pushback: 2,
    taxi_pre: 2,
    takeoff: 4,
    landing: 4,
    taxi_post: 2,
};

describe('phraseology TEMPLATES', () => {
    it('covers all 6 phases', () => {
        expect(Object.keys(TEMPLATES).sort()).toEqual([...PHASE_ORDER].sort());
    });

    it('has PT and EN for every phase', () => {
        for (const phase of PHASE_ORDER) {
            expect(TEMPLATES[phase]).toHaveProperty('PT');
            expect(TEMPLATES[phase]).toHaveProperty('EN');
        }
    });

    it('has the correct number of templates per phase and language', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                expect(TEMPLATES[phase][lang]).toHaveLength(EXPECTED_COUNTS[phase]);
            }
        }
    });

    it('every template has a unique id', () => {
        const ids = new Set<string>();
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of TEMPLATES[phase][lang]) {
                    expect(ids.has(t.id)).toBe(false);
                    ids.add(t.id);
                }
            }
        }
    });

    it('every template has matching phase and language', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of TEMPLATES[phase][lang]) {
                    expect(t.phase).toBe(phase);
                    expect(t.language).toBe(lang);
                }
            }
        }
    });

    it('every template starts with a callsign field segment', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of TEMPLATES[phase][lang]) {
                    expect(t.segments[0]).toEqual({ type: 'field', value: 'callsign' });
                }
            }
        }
    });
});

describe('getTemplates', () => {
    it('returns the same array as TEMPLATES for each phase/language', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                expect(getTemplates(phase, lang)).toBe(TEMPLATES[phase][lang]);
            }
        }
    });
});
