// Native modules
import path from 'path';
import util from 'util';
import fs from 'fs';
// External modules
import Papa from 'papaparse';
// Utils
import DefaultMap from '@/utils/defaultMap';
// Types
import { Condition, DiagnosticMetric } from '@/types/diagnostics';

const readFile = util.promisify(fs.readFile);

async function readStaticFile<T>(fp: string) {
  const filePath = path.resolve('.', fp);

  try {
    const data = await readFile(filePath, 'utf-8');
    const results = Papa.parse<T>(data, {
      header: true,
      dynamicTyping: true
    });
    return results;
  } catch (err) {
    console.error('Error reading the file:', err);
    return null;
  }
}

const readDiagnosticMetrics = async () =>
  readStaticFile<DiagnosticMetric>('static/diagnostic_metrics.csv');

const readConditions = async () =>
  readStaticFile<Condition>('static/conditions.csv');

type OruSonicCode = string;

export class DiagnosticLookup {
  private diagnosticMetrics: DiagnosticMetric[];
  // We store the DiagnosticMetrics in a list, rather than another indexed data structure
  // as there are not a lot of possible diagnostic metrics for a single sonic_code
  private oruSonicCodeIndex: Map<OruSonicCode, DiagnosticMetric[]>;

  constructor(diagnosticMetrics: DiagnosticMetric[]) {
    this.diagnosticMetrics = diagnosticMetrics;
    this.oruSonicCodeIndex = this.generateORUSonicCodeIndex();
  }

  private generateORUSonicCodeIndex() {
    const oruSonicCodeIndex = new DefaultMap<string, DiagnosticMetric[]>(
      () => []
    );
    this.diagnosticMetrics.forEach((metric) => {
      if (metric.oru_sonic_codes && metric.oru_sonic_units) {
        const codes = metric.oru_sonic_codes.split(';');
        codes.forEach((code) => oruSonicCodeIndex.get(code).push(metric));
      }
    });
    return oruSonicCodeIndex;
  }

  getDiagnosticMetric(
    sonic_code: string,
    sonic_unit: string,
    age: number,
    gender: 'Male' | 'Female'
  ) {
    const diagnosticMetrics = this.oruSonicCodeIndex.get(sonic_code);
    if (!diagnosticMetrics) {
      return null;
    }

    diagnosticMetrics
      .filter((metric: DiagnosticMetric) => {
        return sonic_unit === metric.oru_sonic_units;
      })
      .filter((metric: DiagnosticMetric) => {
        if (metric.gender === 'Any') {
          return true;
        }
        return gender === metric.gender;
      })
      .filter((metric: DiagnosticMetric) => {
        const minAge = metric.min_age === undefined ? 0 : metric.min_age;
        const maxAge = metric.max_age === undefined ? 200 : metric.max_age;
        return minAge <= age && age <= maxAge;
      });

    return diagnosticMetrics ? diagnosticMetrics[0] : null;
  }
}

export const initDiagnosticLookup = async () => {
  // This is a function that reads the diagnostic metrics from a file and returns a DiagnosticLookup object
  const diagnosticMetrics = await readDiagnosticMetrics();
  if (!diagnosticMetrics || diagnosticMetrics.errors.length > 0) {
    console.error('Error reading the diagnostic metrics');
    return null;
  }

  return new DiagnosticLookup(diagnosticMetrics.data);
};

type DiagnosticMetricName = string;
type ConditionName = string;

export class ConditionLookup {
  // This is a class that stores the conditions and provides a method to look up potential conditions by diagnostic metric name
  private conditions: Condition[];
  private conditionIndex: DefaultMap<DiagnosticMetricName, ConditionName[]>;

  constructor(conditions: Condition[]) {
    this.conditions = conditions;
    this.conditionIndex = this.generateConditionIndex();
  }

  private generateConditionIndex() {
    const conditionIndex = new DefaultMap<string, ConditionName[]>(() => []);
    this.conditions.forEach((condition) => {
      condition.diagnostic_metrics.split(',').forEach((metric: string) => {
        conditionIndex.get(metric).push(condition.name);
      });
    });
    return conditionIndex;
  }

  getConditions(name: string) {
    return this.conditionIndex.get(name);
  }
}

export const initConditionLookup = async () => {
  // This is a function that reads the conditions from a file and returns a ConditionLookup object
  const conditions = await readConditions();
  if (!conditions || conditions.errors.length > 0) {
    console.error('Error reading the diagnostic metrics');
    return null;
  }

  return new ConditionLookup(conditions.data);
};
