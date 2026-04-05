import type { ControlPhase, Language, PhraseologyTemplate } from '../types';

/**
 * All phraseology templates organized by control phase and language.
 * Field names in segments match the ATIS_FIELD_MAP keys in src/utils/templates.ts.
 */
export const TEMPLATES: Record<ControlPhase, Record<Language, PhraseologyTemplate[]>> = {
    clearance: {
        PT: [
            {
                id: 'clr-pt-1',
                phase: 'clearance',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', Torre ' },
                    { type: 'field', value: 'aeroporto' },
                    { type: 'text', value: ', prossiga' },
                ],
            },
            {
                id: 'clr-pt-2',
                phase: 'clearance',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', mantenha na escuta, aguarde autorização' },
                ],
            },
            {
                id: 'clr-pt-3',
                phase: 'clearance',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', autorizado ' },
                    { type: 'field', value: 'destino' },
                    { type: 'text', value: ', conforme rota do plano de voo, saída ' },
                    { type: 'field', value: 'SID/rota' },
                    { type: 'text', value: ', nível de voo ' },
                    { type: 'field', value: 'nível' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'pista' },
                    { type: 'text', value: ', transponder ' },
                    { type: 'field', value: 'código transponder' },
                    { type: 'text', value: '. Informação ' },
                    { type: 'field', value: 'letra_ATIS' },
                    { type: 'text', value: '. Coteja' },
                ],
            },
            {
                id: 'clr-pt-4',
                phase: 'clearance',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', cotejamento correto' },
                ],
            },
            {
                id: 'clr-pt-5',
                phase: 'clearance',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', chame quando pronto para pushback e acionamento' },
                ],
            },
            {
                id: 'clr-pt-6',
                phase: 'clearance',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', contate solo na frequência ' },
                    { type: 'field', value: 'frequência_handoff' },
                ],
            },
        ],
        EN: [
            {
                id: 'clr-en-1',
                phase: 'clearance',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', ' },
                    { type: 'field', value: 'aeroporto' },
                    { type: 'text', value: ' Tower, go ahead' },
                ],
            },
            {
                id: 'clr-en-2',
                phase: 'clearance',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', standby, hold for clearance' },
                ],
            },
            {
                id: 'clr-en-3',
                phase: 'clearance',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', cleared to ' },
                    { type: 'field', value: 'destino' },
                    { type: 'text', value: ', as per filed route, departure ' },
                    { type: 'field', value: 'SID/rota' },
                    { type: 'text', value: ', flight level ' },
                    { type: 'field', value: 'nível' },
                    { type: 'text', value: ', runway ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', squawk ' },
                    { type: 'field', value: 'código transponder' },
                    { type: 'text', value: ', information ' },
                    { type: 'field', value: 'atis_letter' },
                    { type: 'text', value: '. Read back' },
                ],
            },
            {
                id: 'clr-en-4',
                phase: 'clearance',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', readback correct' },
                ],
            },
            {
                id: 'clr-en-5',
                phase: 'clearance',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', call when ready for pushback and startup' },
                ],
            },
            {
                id: 'clr-en-6',
                phase: 'clearance',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', contact ground ' },
                    { type: 'field', value: 'frequência_handoff' },
                ],
            },
        ],
        ES: [
            {
                id: 'clr-es-1',
                phase: 'clearance',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', Torre ' },
                    { type: 'field', value: 'aeroporto' },
                    { type: 'text', value: ', adelante' },
                ],
            },
            {
                id: 'clr-es-2',
                phase: 'clearance',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', mantenga escucha, espere autorización' },
                ],
            },
            {
                id: 'clr-es-3',
                phase: 'clearance',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', autorizado a ' },
                    { type: 'field', value: 'destino' },
                    { type: 'text', value: ', conforme ruta del plan de vuelo, salida ' },
                    { type: 'field', value: 'SID/rota' },
                    { type: 'text', value: ', nivel de vuelo ' },
                    { type: 'field', value: 'nível' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', transponder ' },
                    { type: 'field', value: 'código transponder' },
                    { type: 'text', value: '. Información ' },
                    { type: 'field', value: 'atis_letter' },
                    { type: 'text', value: '. Colacione' },
                ],
            },
            {
                id: 'clr-es-4',
                phase: 'clearance',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', colación correcta' },
                ],
            },
            {
                id: 'clr-es-5',
                phase: 'clearance',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', llame listo para pushback y encendido' },
                ],
            },
            {
                id: 'clr-es-6',
                phase: 'clearance',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', contacte tierra en frecuencia ' },
                    { type: 'field', value: 'frequência_handoff' },
                ],
            },
        ],
    },
    pushback: {
        PT: [
            {
                id: 'push-pt-1',
                phase: 'pushback',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', autorizado pushback e acionamento, cauda para ' },
                    { type: 'field', value: 'direção_pushback' },
                    { type: 'text', value: ', limitado a ' },
                    { type: 'field', value: 'limitação' },
                ],
            },
            {
                id: 'push-pt-2',
                phase: 'pushback',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', chame quando pronto para táxi' },
                ],
            },
        ],
        EN: [
            {
                id: 'push-en-1',
                phase: 'pushback',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pushback and startup approved, tail ' },
                    { type: 'field', value: 'direção_pushback' },
                    { type: 'text', value: ', restricted to ' },
                    { type: 'field', value: 'limitação' },
                ],
            },
            {
                id: 'push-en-2',
                phase: 'pushback',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', call when ready for taxi' },
                ],
            },
        ],
        ES: [
            {
                id: 'push-es-1',
                phase: 'pushback',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', autorizado pushback y encendido, cola hacia ' },
                    { type: 'field', value: 'direção_pushback' },
                    { type: 'text', value: ', limitado a ' },
                    { type: 'field', value: 'limitação' },
                ],
            },
            {
                id: 'push-es-2',
                phase: 'pushback',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', llame listo para rodaje' },
                ],
            },
        ],
    },
    taxi_pre: {
        PT: [
            {
                id: 'txpre-pt-1',
                phase: 'taxi_pre',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', táxi para ponto de espera pista ' },
                    { type: 'field', value: 'pista' },
                    { type: 'text', value: ', via ' },
                    { type: 'field', value: 'taxiways' },
                ],
            },
            {
                id: 'txpre-pt-2',
                phase: 'taxi_pre',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', contate torre na frequência ' },
                    { type: 'field', value: 'frequência_handoff' },
                ],
            },
        ],
        EN: [
            {
                id: 'txpre-en-1',
                phase: 'taxi_pre',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', taxi to holding point runway ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', via ' },
                    { type: 'field', value: 'taxiways' },
                ],
            },
            {
                id: 'txpre-en-2',
                phase: 'taxi_pre',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', contact tower ' },
                    { type: 'field', value: 'frequência_handoff' },
                ],
            },
        ],
        ES: [
            {
                id: 'txpre-es-1',
                phase: 'taxi_pre',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', ruede al punto de espera pista ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', vía ' },
                    { type: 'field', value: 'taxiways' },
                ],
            },
            {
                id: 'txpre-es-2',
                phase: 'taxi_pre',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', contacte torre en frecuencia ' },
                    { type: 'field', value: 'frequência_handoff' },
                ],
            },
        ],
    },
    takeoff: {
        PT: [
            {
                id: 'tko-pt-1',
                phase: 'takeoff',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'pista' },
                    { type: 'text', value: ', alinhe e mantenha' },
                ],
            },
            {
                id: 'tko-pt-2b',
                phase: 'takeoff',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'pista' },
                    { type: 'text', value: ', ingresse, backtrack e alinhe (pistas pequenas)' },
                ],
            },
            {
                id: 'tko-pt-3',
                phase: 'takeoff',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'pista' },
                    { type: 'text', value: ', autorizado decolagem, vento ' },
                    { type: 'field', value: 'direção' },
                    { type: 'text', value: ' graus ' },
                    { type: 'field', value: 'velocidade' },
                    { type: 'text', value: ' nós, ajuste altímetro ' },
                    { type: 'field', value: 'QNH' },
                ],
            },
            {
                id: 'tko-pt-4',
                phase: 'takeoff',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', após decolagem contate ' },
                    { type: 'field', value: 'órgão' },
                    { type: 'text', value: ' ' },
                    { type: 'field', value: 'frequência' },
                    { type: 'text', value: '. Bom voo' },
                ],
            },
        ],
        EN: [
            {
                id: 'tko-en-1',
                phase: 'takeoff',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', runway ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', line up and wait' },
                ],
            },
            {
                id: 'tko-en-2b',
                phase: 'takeoff',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', runway ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', enter, backtrack and line up (small airports)' },
                ],
            },
            {
                id: 'tko-en-3',
                phase: 'takeoff',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', runway ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', cleared for takeoff, wind ' },
                    { type: 'field', value: 'direction' },
                    { type: 'text', value: ' degrees ' },
                    { type: 'field', value: 'speed' },
                    { type: 'text', value: ' knots, altimeter ' },
                    { type: 'field', value: 'qnh' },
                ],
            },
            {
                id: 'tko-en-4',
                phase: 'takeoff',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', after departure contact ' },
                    { type: 'field', value: 'órgão' },
                    { type: 'text', value: ' ' },
                    { type: 'field', value: 'frequência' },
                    { type: 'text', value: '. Good day' },
                ],
            },
        ],
        ES: [
            {
                id: 'tko-es-1',
                phase: 'takeoff',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', alinee y mantenga' },
                ],
            },
            {
                id: 'tko-es-2b',
                phase: 'takeoff',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', ingrese, backtrack y alinee (pistas pequeñas)' },
                ],
            },
            {
                id: 'tko-es-3',
                phase: 'takeoff',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', autorizado despegue, viento ' },
                    { type: 'field', value: 'direction' },
                    { type: 'text', value: ' grados ' },
                    { type: 'field', value: 'speed' },
                    { type: 'text', value: ' nudos, altímetro ' },
                    { type: 'field', value: 'qnh' },
                ],
            },
            {
                id: 'tko-es-4',
                phase: 'takeoff',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', después del despegue contacte ' },
                    { type: 'field', value: 'órgão' },
                    { type: 'text', value: ' ' },
                    { type: 'field', value: 'frequência' },
                    { type: 'text', value: '. Buen vuelo' },
                ],
            },
        ],
    },
    landing: {
        PT: [
            {
                id: 'lnd-pt-2',
                phase: 'landing',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'pista' },
                    { type: 'text', value: ', continue aproximação, número ' },
                    { type: 'field', value: 'sequência' },
                ],
            },
            {
                id: 'lnd-pt-1',
                phase: 'landing',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'pista' },
                    { type: 'text', value: ', autorizado pouso, vento ' },
                    { type: 'field', value: 'direção' },
                    { type: 'text', value: ' graus ' },
                    { type: 'field', value: 'velocidade' },
                    { type: 'text', value: ' nós, ajuste altímetro ' },
                    { type: 'field', value: 'QNH' },
                ],
            },
            {
                id: 'lnd-pt-4b',
                phase: 'landing',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', arremetida, suba para ' },
                    { type: 'field', value: 'altitude' },
                    { type: 'text', value: ', proa ' },
                    { type: 'field', value: 'heading' },
                    { type: 'text', value: ', siga o procedimento de aproximação perdida' },
                ],
            },
            {
                id: 'lnd-pt-4',
                phase: 'landing',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', no solo ' },
                    { type: 'field', value: 'hora' },
                    { type: 'text', value: ':' },
                    { type: 'field', value: 'minutos' },
                    { type: 'text', value: ', bem-vindo a ' },
                    { type: 'field', value: 'aeroporto' },
                    { type: 'text', value: '. Livre a pista quando possível' },
                ],
            },
        ],
        EN: [
            {
                id: 'lnd-en-2',
                phase: 'landing',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', runway ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', continue approach, number ' },
                    { type: 'field', value: 'sequência' },
                ],
            },
            {
                id: 'lnd-en-1',
                phase: 'landing',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', runway ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', cleared to land, wind ' },
                    { type: 'field', value: 'direction' },
                    { type: 'text', value: ' degrees ' },
                    { type: 'field', value: 'speed' },
                    { type: 'text', value: ' knots, altimeter ' },
                    { type: 'field', value: 'qnh' },
                ],
            },
            {
                id: 'lnd-en-4b',
                phase: 'landing',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', go around, climb ' },
                    { type: 'field', value: 'altitude' },
                    { type: 'text', value: ', heading ' },
                    { type: 'field', value: 'heading' },
                    { type: 'text', value: ', follow published missed approach procedure' },
                ],
            },
            {
                id: 'lnd-en-4',
                phase: 'landing',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', welcome to ' },
                    { type: 'field', value: 'aeroporto' },
                    { type: 'text', value: '. Vacate runway when able' },
                ],
            },
        ],
        ES: [
            {
                id: 'lnd-es-2',
                phase: 'landing',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', continúe aproximación, número ' },
                    { type: 'field', value: 'sequência' },
                ],
            },
            {
                id: 'lnd-es-1',
                phase: 'landing',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', pista ' },
                    { type: 'field', value: 'runway' },
                    { type: 'text', value: ', autorizado aterrizaje, viento ' },
                    { type: 'field', value: 'direction' },
                    { type: 'text', value: ' grados ' },
                    { type: 'field', value: 'speed' },
                    { type: 'text', value: ' nudos, altímetro ' },
                    { type: 'field', value: 'qnh' },
                ],
            },
            {
                id: 'lnd-es-3',
                phase: 'landing',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', en tierra ' },
                    { type: 'field', value: 'hora' },
                    { type: 'text', value: ':' },
                    { type: 'field', value: 'minutos' },
                    { type: 'text', value: ', bienvenido a ' },
                    { type: 'field', value: 'aeroporto' },
                    { type: 'text', value: '. Libere la pista cuando sea posible' },
                ],
            },
            {
                id: 'lnd-es-4b',
                phase: 'landing',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', frustrada, ascienda a ' },
                    { type: 'field', value: 'altitude' },
                    { type: 'text', value: ', rumbo ' },
                    { type: 'field', value: 'heading' },
                    { type: 'text', value: ', siga el procedimiento de aproximación frustrada publicado' },
                ],
            },
        ],
    },
    taxi_post: {
        PT: [
            {
                id: 'txpost-pt-1',
                phase: 'taxi_post',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', livre a pista via ' },
                    { type: 'field', value: 'taxiway_saída' },
                    { type: 'text', value: ', táxi para pátio ' },
                    { type: 'field', value: 'pátio' },
                    { type: 'text', value: ' via ' },
                    { type: 'field', value: 'taxiways' },
                ],
            },
            {
                id: 'txpost-pt-2',
                phase: 'taxi_post',
                language: 'PT',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', táxi para pátio ' },
                    { type: 'field', value: 'pátio' },
                    { type: 'text', value: ', posição a critério' },
                ],
            },
        ],
        EN: [
            {
                id: 'txpost-en-1',
                phase: 'taxi_post',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', vacate via ' },
                    { type: 'field', value: 'taxiway_saída' },
                    { type: 'text', value: ', taxi to apron ' },
                    { type: 'field', value: 'pátio' },
                    { type: 'text', value: ' via ' },
                    { type: 'field', value: 'taxiways' },
                ],
            },
            {
                id: 'txpost-en-2',
                phase: 'taxi_post',
                language: 'EN',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', taxi to apron ' },
                    { type: 'field', value: 'pátio' },
                    { type: 'text', value: ', stand at your discretion' },
                ],
            },
        ],
        ES: [
            {
                id: 'txpost-es-1',
                phase: 'taxi_post',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', libere la pista vía ' },
                    { type: 'field', value: 'taxiway_saída' },
                    { type: 'text', value: ', ruede a plataforma ' },
                    { type: 'field', value: 'pátio' },
                    { type: 'text', value: ' vía ' },
                    { type: 'field', value: 'taxiways' },
                ],
            },
            {
                id: 'txpost-es-2',
                phase: 'taxi_post',
                language: 'ES',
                segments: [
                    { type: 'field', value: 'callsign' },
                    { type: 'text', value: ', ruede a plataforma ' },
                    { type: 'field', value: 'pátio' },
                    { type: 'text', value: ', posición a criterio' },
                ],
            },
        ],
    },
};


/**
 * Returns the phraseology templates for a given control phase and language.
 */
export function getTemplates(phase: ControlPhase, language: Language): PhraseologyTemplate[] {
    return TEMPLATES[phase][language];
}
