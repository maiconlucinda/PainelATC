// Tipos base
export type ATCPosition = 'DEL' | 'GND' | 'TWR' | 'TWR_COMBINED';
export type ControlPhase = 'clearance' | 'pushback' | 'taxi_pre' | 'takeoff' | 'landing' | 'taxi_post';
export type Language = 'PT' | 'EN' | 'ES';

// Mapeamento de fases visíveis por posição
export const PHASE_VISIBILITY: Record<ATCPosition, ControlPhase[]> = {
    DEL: ['clearance'],
    GND: ['pushback', 'taxi_pre'],
    TWR: ['takeoff', 'landing', 'taxi_post'],
    TWR_COMBINED: ['clearance', 'pushback', 'taxi_pre', 'takeoff', 'landing', 'taxi_post'],
};

// Ordem sequencial das fases
export const PHASE_ORDER: ControlPhase[] = [
    'clearance', 'pushback', 'taxi_pre', 'takeoff', 'landing', 'taxi_post'
];

// Interfaces do estado
export interface ATISConfig {
    airportName: string;
    letter: string;
    runwayDeparture: string;
    runwayArrival: string;
    windDirection: string;
    windSpeed: string;
    qnh: string;
    visibility: string;
    defaultSquawk: string;
}

export interface Aircraft {
    callsign: string;
    language: Language;
    currentPhase: ControlPhase;
    fieldValues: Record<ControlPhase, Record<string, string>>;
}

export interface Runway {
    id: string;
    identifier: string;
    isActive: boolean;
}

export interface FrequencyConfig {
    ground: string;
    tower: string;
    departure: string;
}

export interface SessionState {
    position: ATCPosition;
    atis: ATISConfig;
    frequencies: FrequencyConfig;
    aircraft: Aircraft[];
    runways: Runway[];
    selectedAircraftCallsign: string | null;
    sessionStarted: boolean;
}

// Actions do Reducer
export type SessionAction =
    | { type: 'SET_POSITION'; payload: ATCPosition }
    | { type: 'START_SESSION' }
    | { type: 'UPDATE_ATIS'; payload: Partial<ATISConfig> }
    | { type: 'UPDATE_FREQUENCIES'; payload: Partial<FrequencyConfig> }
    | { type: 'ADD_AIRCRAFT'; payload: string }
    | { type: 'REMOVE_AIRCRAFT'; payload: string }
    | { type: 'SELECT_AIRCRAFT'; payload: string | null }
    | { type: 'ADVANCE_PHASE'; payload: string }
    | { type: 'RETREAT_PHASE'; payload: string }
    | { type: 'SET_LANGUAGE'; payload: { callsign: string; language: Language } }
    | { type: 'UPDATE_FIELD'; payload: { callsign: string; phase: ControlPhase; fieldName: string; value: string } }
    | { type: 'ADD_RUNWAY'; payload: string }
    | { type: 'REMOVE_RUNWAY'; payload: string }
    | { type: 'SET_ACTIVE_RUNWAY'; payload: string }
    | { type: 'RESTORE_SESSION'; payload: SessionState }
    | { type: 'CLEAR_SESSION' };

// Modelos de dados de fraseologia
export interface TemplateSegment {
    type: 'text' | 'field';
    value: string;
}

export interface PhraseologyTemplate {
    id: string;
    phase: ControlPhase;
    language: Language;
    segments: TemplateSegment[];
}

// Estado inicial
export const INITIAL_STATE: SessionState = {
    position: 'TWR_COMBINED',
    atis: {
        airportName: '',
        letter: '',
        runwayDeparture: '',
        runwayArrival: '',
        windDirection: '',
        windSpeed: '',
        qnh: '',
        visibility: '',
        defaultSquawk: '',
    },
    frequencies: {
        ground: '',
        tower: '',
        departure: '',
    },
    aircraft: [],
    runways: [],
    selectedAircraftCallsign: null,
    sessionStarted: false,
};
