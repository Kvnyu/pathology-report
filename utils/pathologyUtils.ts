// TODO: Type this library properly
import HL7 from 'hl7-standard';
// Types
import {
  Diagnostic,
  DiagnosticGroup,
  EnrichedDiagnosticMetric
} from '@/types/diagnostics';
import DefaultMap from './defaultMap';

const initHL7Parser = (data: string) => {
  const hl7Parser = new HL7(data, { lineEndings: '\n' });
  try {
    hl7Parser.transform();
  } catch (e) {
    console.error(e);
    return null;
  }
  return hl7Parser;
};

const oruToMetricGender: Record<'M' | 'F', 'Male' | 'Female'> = {
  M: 'Male',
  F: 'Female'
};

function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n) && n !== undefined;
}

function normalisePatientValue(value: string): number {
  if (value.includes('<')) {
    return parseFloat(value.split(' ')[1]);
  } else if (value.includes('>')) {
    return parseFloat(value.split(' ')[1]);
  }
  return parseFloat(value);
}

function isMetricAbnormal(metric: EnrichedDiagnosticMetric): boolean {
  const patientValue = normalisePatientValue(metric.patientValue);

  if (isNumber(metric.everlabLower) && isNumber(metric.everlabHigher)) {
    const lower = metric.everlabLower as number;
    const higher = metric.everlabHigher as number;
    return patientValue < lower || patientValue > higher;
  } else if (isNumber(metric.everlabLower)) {
    const lower = metric.everlabLower as number;
    return patientValue < lower;
  } else if (isNumber(metric.everlabHigher)) {
    const higher = metric.everlabHigher as number;
    return patientValue > higher;
  }

  return false;
}

const getAbnormalDiagnosticMetrics = (
  diagnosticGroups: DiagnosticGroup[]
): EnrichedDiagnosticMetric[] => {
  return diagnosticGroups
    .map((diagnosticGroup: DiagnosticGroup) => diagnosticGroup.diagnostics)
    .flat()
    .map((diagnostic: Diagnostic) => diagnostic.metrics)
    .flat()
    .filter(isMetricAbnormal);
};
export interface AbnormalDiagnosticGroup {
  name: string;
  conditions: string[];
}

const getAbnormalDiagnosticGroups = (diagnosticGroups: DiagnosticGroup[]) => {
  const abnormalDiagnosticMetrics =
    getAbnormalDiagnosticMetrics(diagnosticGroups);
  const tempAbnormalDiagnosticGroups = new DefaultMap<string, Set<string>>(
    () => new Set()
  );

  abnormalDiagnosticMetrics.forEach((metric) => {
    metric.potentialConditions.forEach((condition) => {
      tempAbnormalDiagnosticGroups.get(metric.diagnosticGroup).add(condition);
    });
  });

  const abnormalDiagnosticGroups: AbnormalDiagnosticGroup[] = [];
  tempAbnormalDiagnosticGroups.forEach((value, key) => {
    abnormalDiagnosticGroups.push({ name: key, conditions: Array.from(value) });
  });

  return abnormalDiagnosticGroups;
};

export {
  initHL7Parser,
  oruToMetricGender,
  isNumber,
  normalisePatientValue,
  isMetricAbnormal,
  getAbnormalDiagnosticGroups
};
