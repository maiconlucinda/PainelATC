import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { TEMPLATES, getTemplates, PILOT_TEMPLATES, getPilotTemplates } from './phraseology';
import type { ControlPhase, Language, ATISConfig } from '../types';
import { PHASE_ORDER } from '../types';
import { renderTemplate } from '../utils/templates';

const LANGUAGES: Language[] = ['PT', 'EN', 'ES'];

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

    it('has PT, EN and ES for every phase', () => {
        for (const phase of PHASE_ORDER) {
            expect(TEMPLATES[phase]).toHaveProperty('PT');
            expect(TEMPLATES[phase]).toHaveProperty('EN');
            expect(TEMPLATES[phase]).toHaveProperty('ES');
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


const PILOT_EXPECTED_COUNTS: Record<ControlPhase, number> = {
    clearance: 3,
    pushback: 2,
    taxi_pre: 3,
    takeoff: 3,
    landing: 5,
    taxi_post: 3,
};

describe('phraseology PILOT_TEMPLATES', () => {
    it('covers all 6 phases', () => {
        expect(Object.keys(PILOT_TEMPLATES).sort()).toEqual([...PHASE_ORDER].sort());
    });

    it('has PT, EN and ES for every phase', () => {
        for (const phase of PHASE_ORDER) {
            expect(PILOT_TEMPLATES[phase]).toHaveProperty('PT');
            expect(PILOT_TEMPLATES[phase]).toHaveProperty('EN');
            expect(PILOT_TEMPLATES[phase]).toHaveProperty('ES');
        }
    });

    it('has the correct number of templates per phase and language', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                expect(PILOT_TEMPLATES[phase][lang]).toHaveLength(PILOT_EXPECTED_COUNTS[phase]);
            }
        }
    });

    it('every template has a unique id', () => {
        const ids = new Set<string>();
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of PILOT_TEMPLATES[phase][lang]) {
                    expect(ids.has(t.id)).toBe(false);
                    ids.add(t.id);
                }
            }
        }
    });

    it('every template has matching phase and language', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of PILOT_TEMPLATES[phase][lang]) {
                    expect(t.phase).toBe(phase);
                    expect(t.language).toBe(lang);
                }
            }
        }
    });

    it('every template ends with a callsign field segment', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of PILOT_TEMPLATES[phase][lang]) {
                    expect(t.segments[t.segments.length - 1]).toEqual({ type: 'field', value: 'callsign' });
                }
            }
        }
    });

    it('pilot template ids do not collide with controller template ids', () => {
        const controllerIds = new Set<string>();
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of TEMPLATES[phase][lang]) {
                    controllerIds.add(t.id);
                }
            }
        }
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                for (const t of PILOT_TEMPLATES[phase][lang]) {
                    expect(controllerIds.has(t.id)).toBe(false);
                }
            }
        }
    });
});

describe('getPilotTemplates', () => {
    it('returns the same array as PILOT_TEMPLATES for each phase/language', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                expect(getPilotTemplates(phase, lang)).toBe(PILOT_TEMPLATES[phase][lang]);
            }
        }
    });
});


/**
 * Bug Condition Exploration Test - Property 1: Pilot Callsign at End
 *
 * **Validates: Requirements 1.1, 2.1, 2.2, 2.3**
 *
 * This test encodes the EXPECTED (correct) behavior: pilot templates should
 * have the callsign as the last segment. On unfixed code, this test is
 * expected to FAIL, confirming the bug exists.
 */
describe('Bug Condition Exploration: Pilot Callsign at End', () => {
    // Collect all pilot templates as [phase, language, template] tuples
    const allPilotTemplates: Array<{ phase: ControlPhase; language: Language; template: typeof PILOT_TEMPLATES[ControlPhase][Language][number] }> = [];
    for (const phase of PHASE_ORDER) {
        for (const lang of LANGUAGES) {
            for (const t of PILOT_TEMPLATES[phase][lang]) {
                allPilotTemplates.push({ phase, language: lang, template: t });
            }
        }
    }

    it('every pilot template has callsign as the last segment (property-based)', () => {
        // Use fast-check to iterate over all pilot templates
        const templateArb = fc.constantFrom(...allPilotTemplates);

        fc.assert(
            fc.property(templateArb, ({ template }) => {
                const lastSegment = template.segments[template.segments.length - 1];
                expect(lastSegment).toEqual({ type: 'field', value: 'callsign' });
            }),
            { numRuns: allPilotTemplates.length * 3 } // Run enough times to cover all templates
        );
    });

    it('rendered pilot template output ends with the callsign (property-based)', () => {
        const templateArb = fc.constantFrom(...allPilotTemplates);
        const callsignArb = fc.stringMatching(/^[A-Z]{3}\d{3}$/);

        const stubAtis: ATISConfig = {
            airportName: 'SBGR',
            letter: 'A',
            runwayDeparture: '10R',
            runwayArrival: '10L',
            windDirection: '180',
            windSpeed: '10',
            qnh: '1013',
            visibility: '9999',
            defaultSquawk: '4510',
        };

        fc.assert(
            fc.property(templateArb, callsignArb, ({ template }, callsign) => {
                const rendered = renderTemplate(template, {}, stubAtis, callsign);
                expect(rendered.endsWith(callsign)).toBe(true);
            }),
            { numRuns: 200 }
        );
    });
});


/**
 * Preservation Property Tests - Property 2: Controller Callsign at Start and Pilot Template Integrity
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 *
 * These tests capture the baseline behavior on UNFIXED code that must be
 * preserved after the fix. All tests here should PASS on unfixed code.
 */
describe('Preservation: Controller Callsign at Start and Pilot Template Integrity', () => {
    // Collect all controller templates
    const allControllerTemplates: Array<{ phase: ControlPhase; language: Language; template: typeof TEMPLATES[ControlPhase][Language][number] }> = [];
    for (const phase of PHASE_ORDER) {
        for (const lang of LANGUAGES) {
            for (const t of TEMPLATES[phase][lang]) {
                allControllerTemplates.push({ phase, language: lang, template: t });
            }
        }
    }

    // Collect all pilot templates
    const allPilotTemplates: Array<{ phase: ControlPhase; language: Language; template: typeof PILOT_TEMPLATES[ControlPhase][Language][number] }> = [];
    for (const phase of PHASE_ORDER) {
        for (const lang of LANGUAGES) {
            for (const t of PILOT_TEMPLATES[phase][lang]) {
                allPilotTemplates.push({ phase, language: lang, template: t });
            }
        }
    }

    // Collect all controller IDs for collision checks
    const controllerIds = new Set<string>();
    for (const phase of PHASE_ORDER) {
        for (const lang of LANGUAGES) {
            for (const t of TEMPLATES[phase][lang]) {
                controllerIds.add(t.id);
            }
        }
    }

    const PILOT_EXPECTED_COUNTS_PRESERVATION: Record<ControlPhase, number> = {
        clearance: 3,
        pushback: 2,
        taxi_pre: 3,
        takeoff: 3,
        landing: 5,
        taxi_post: 3,
    };

    it('controller callsign position: every controller template starts with callsign field (property-based)', () => {
        const templateArb = fc.constantFrom(...allControllerTemplates);

        fc.assert(
            fc.property(templateArb, ({ template }) => {
                expect(template.segments[0]).toEqual({ type: 'field', value: 'callsign' });
            }),
            { numRuns: allControllerTemplates.length * 3 }
        );
    });

    it('pilot template counts: each phase/language has the expected number of pilot templates', () => {
        for (const phase of PHASE_ORDER) {
            for (const lang of LANGUAGES) {
                expect(PILOT_TEMPLATES[phase][lang]).toHaveLength(
                    PILOT_EXPECTED_COUNTS_PRESERVATION[phase]
                );
            }
        }
    });

    it('pilot template IDs: all start with p- and do not collide with controller IDs (property-based)', () => {
        const templateArb = fc.constantFrom(...allPilotTemplates);

        fc.assert(
            fc.property(templateArb, ({ template }) => {
                expect(template.id.startsWith('p-')).toBe(true);
                expect(controllerIds.has(template.id)).toBe(false);
            }),
            { numRuns: allPilotTemplates.length * 3 }
        );
    });

    it('pilot template metadata: every pilot template has matching phase and language fields (property-based)', () => {
        const templateArb = fc.constantFrom(...allPilotTemplates);

        fc.assert(
            fc.property(templateArb, ({ phase, language, template }) => {
                expect(template.phase).toBe(phase);
                expect(template.language).toBe(language);
            }),
            { numRuns: allPilotTemplates.length * 3 }
        );
    });

    it('rendered controller output: starts with the callsign (property-based)', () => {
        const templateArb = fc.constantFrom(...allControllerTemplates);
        const callsignArb = fc.stringMatching(/^[A-Z]{3}\d{3}$/);

        const stubAtis: ATISConfig = {
            airportName: 'SBGR',
            letter: 'A',
            runwayDeparture: '10R',
            runwayArrival: '10L',
            windDirection: '180',
            windSpeed: '10',
            qnh: '1013',
            visibility: '9999',
            defaultSquawk: '4510',
        };

        fc.assert(
            fc.property(templateArb, callsignArb, ({ template }, callsign) => {
                const rendered = renderTemplate(template, {}, stubAtis, callsign);
                expect(rendered.startsWith(callsign)).toBe(true);
            }),
            { numRuns: 200 }
        );
    });
});


/**
 * Bug Condition Exploration Test - Property 1: Missing Pilot Readback Templates
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 *
 * This test encodes the EXPECTED (correct) behavior: 7 missing pilot readback
 * templates should exist across all 3 languages with correct IDs, metadata,
 * and callsign as the last segment.
 *
 * On UNFIXED code, this test is expected to FAIL, confirming the bug exists.
 * DO NOT fix the code or the test when it fails.
 */
describe('Bug Condition Exploration: Missing Pilot Readback Templates', () => {
    // The 7 missing readback cases with their expected template IDs per language
    const MISSING_READBACK_CASES: Array<{
        phase: ControlPhase;
        instructionType: string;
        expectedIds: Record<Language, string>;
    }> = [
            {
                phase: 'pushback',
                instructionType: 'pushback_authorization',
                expectedIds: { PT: 'p-push-pt-2', EN: 'p-push-en-2', ES: 'p-push-es-2' },
            },
            {
                phase: 'taxi_pre',
                instructionType: 'frequency_handoff_tower',
                expectedIds: { PT: 'p-txpre-pt-3', EN: 'p-txpre-en-3', ES: 'p-txpre-es-3' },
            },
            {
                phase: 'takeoff',
                instructionType: 'line_up_and_wait',
                expectedIds: { PT: 'p-tko-pt-3', EN: 'p-tko-en-3', ES: 'p-tko-es-3' },
            },
            {
                phase: 'takeoff',
                instructionType: 'post_takeoff_handoff',
                expectedIds: { PT: 'p-tko-pt-4', EN: 'p-tko-en-4', ES: 'p-tko-es-4' },
            },
            {
                phase: 'landing',
                instructionType: 'continue_approach',
                expectedIds: { PT: 'p-lnd-pt-4', EN: 'p-lnd-en-4', ES: 'p-lnd-es-4' },
            },
            {
                phase: 'landing',
                instructionType: 'go_around',
                expectedIds: { PT: 'p-lnd-pt-5', EN: 'p-lnd-en-5', ES: 'p-lnd-es-5' },
            },
            {
                phase: 'taxi_post',
                instructionType: 'vacate_and_taxi',
                expectedIds: { PT: 'p-txpost-pt-3', EN: 'p-txpost-en-3', ES: 'p-txpost-es-3' },
            },
        ];

    // Expected pilot template counts AFTER the fix
    const EXPECTED_PILOT_COUNTS_AFTER_FIX: Record<ControlPhase, number> = {
        clearance: 3,
        pushback: 2,
        taxi_pre: 3,
        takeoff: 3,
        landing: 5,
        taxi_post: 3,
    };

    // Build all (case, language) pairs for property-based iteration
    const allCaseLanguagePairs = MISSING_READBACK_CASES.flatMap((c) =>
        LANGUAGES.map((lang) => ({ ...c, lang }))
    );

    it('each missing readback template exists with the correct ID (property-based)', () => {
        const pairArb = fc.constantFrom(...allCaseLanguagePairs);

        fc.assert(
            fc.property(pairArb, ({ phase, lang, expectedIds }) => {
                const templates = PILOT_TEMPLATES[phase][lang];
                const expectedId = expectedIds[lang];
                const found = templates.find((t) => t.id === expectedId);
                expect(found).toBeDefined();
            }),
            { numRuns: allCaseLanguagePairs.length * 3 }
        );
    });

    it('each missing readback template has correct phase and language metadata (property-based)', () => {
        const pairArb = fc.constantFrom(...allCaseLanguagePairs);

        fc.assert(
            fc.property(pairArb, ({ phase, lang, expectedIds }) => {
                const templates = PILOT_TEMPLATES[phase][lang];
                const expectedId = expectedIds[lang];
                const found = templates.find((t) => t.id === expectedId);
                expect(found).toBeDefined();
                expect(found!.phase).toBe(phase);
                expect(found!.language).toBe(lang);
            }),
            { numRuns: allCaseLanguagePairs.length * 3 }
        );
    });

    it('each missing readback template has callsign as the last segment (property-based)', () => {
        const pairArb = fc.constantFrom(...allCaseLanguagePairs);

        fc.assert(
            fc.property(pairArb, ({ phase, lang, expectedIds }) => {
                const templates = PILOT_TEMPLATES[phase][lang];
                const expectedId = expectedIds[lang];
                const found = templates.find((t) => t.id === expectedId);
                expect(found).toBeDefined();
                const lastSegment = found!.segments[found!.segments.length - 1];
                expect(lastSegment).toEqual({ type: 'field', value: 'callsign' });
            }),
            { numRuns: allCaseLanguagePairs.length * 3 }
        );
    });

    it('each missing readback template ID starts with p- (property-based)', () => {
        const pairArb = fc.constantFrom(...allCaseLanguagePairs);

        fc.assert(
            fc.property(pairArb, ({ phase, lang, expectedIds }) => {
                const templates = PILOT_TEMPLATES[phase][lang];
                const expectedId = expectedIds[lang];
                const found = templates.find((t) => t.id === expectedId);
                expect(found).toBeDefined();
                expect(found!.id.startsWith('p-')).toBe(true);
            }),
            { numRuns: allCaseLanguagePairs.length * 3 }
        );
    });

    it('pilot template counts match expected values after fix (property-based)', () => {
        const phaseLanguageArb = fc.constantFrom(
            ...PHASE_ORDER.flatMap((phase) => LANGUAGES.map((lang) => ({ phase, lang })))
        );

        fc.assert(
            fc.property(phaseLanguageArb, ({ phase, lang }) => {
                expect(PILOT_TEMPLATES[phase][lang]).toHaveLength(
                    EXPECTED_PILOT_COUNTS_AFTER_FIX[phase]
                );
            }),
            { numRuns: PHASE_ORDER.length * LANGUAGES.length * 3 }
        );
    });
});
