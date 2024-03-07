import { Gender } from './patient';

export interface DiagnosticMetric {
  name: string;
  oru_sonic_codes?: string;
  diagnostic?: string;
  diagnostic_groups?: string;
  oru_sonic_units?: string;
  units?: string;
  min_age?: number;
  max_age?: number;
  gender: Gender;
  standard_lower?: number;
  standard_higher?: number;
  everlab_lower?: number;
  everlab_higher?: number;
}

export interface Condition {
  name: string;
  diagnostic_metrics: string;
}

export interface EnrichedDiagnosticMetric {
  name: string;
  diagnosticGroup: string;
  diagnostic: string;
  patientValue: string;
  everlabLower?: number;
  everlabHigher?: number;
  unit?: string;
  minAge?: number;
  maxAge?: number;
  potentialConditions: string[];
}

export interface Diagnostic {
  name: string;
  metrics: EnrichedDiagnosticMetric[];
}

export interface DiagnosticGroup {
  name: string;
  diagnostics: Diagnostic[];
}
