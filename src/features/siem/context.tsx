'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { SecurityEvent, DetectionRule, DetectionResult, EventFilters } from './types';

interface SiemState {
  events: SecurityEvent[];
  rules: DetectionRule[];
  detections: DetectionResult[];
  filters: EventFilters;
  selectedEvent: SecurityEvent | null;
  loading: boolean;
  error: string | null;
}

type SiemAction =
  | { type: 'SET_EVENTS'; payload: SecurityEvent[] }
  | { type: 'SET_RULES'; payload: DetectionRule[] }
  | { type: 'SET_DETECTIONS'; payload: DetectionResult[] }
  | { type: 'SET_FILTERS'; payload: EventFilters }
  | { type: 'SELECT_EVENT'; payload: SecurityEvent | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FILTERS' };

const initialState: SiemState = {
  events: [],
  rules: [],
  detections: [],
  filters: {},
  selectedEvent: null,
  loading: false,
  error: null,
};

function siemReducer(state: SiemState, action: SiemAction): SiemState {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'SET_RULES':
      return { ...state, rules: action.payload };
    case 'SET_DETECTIONS':
      return { ...state, detections: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SELECT_EVENT':
      return { ...state, selectedEvent: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_FILTERS':
      return { ...state, filters: {} };
    default:
      return state;
  }
}

interface SiemContextValue {
  state: SiemState;
  dispatch: React.Dispatch<SiemAction>;
}

const SiemContext = createContext<SiemContextValue | undefined>(undefined);

export function SiemProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(siemReducer, initialState);

  return (
    <SiemContext.Provider value={{ state, dispatch }}>
      {children}
    </SiemContext.Provider>
  );
}

export function useSiem() {
  const context = useContext(SiemContext);
  if (context === undefined) {
    throw new Error('useSiem must be used within a SiemProvider');
  }
  return context;
}
