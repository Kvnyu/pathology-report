// Internal modules
import { ConditionLookup, DiagnosticLookup } from './lookupStructures';
// Types
import { DiagnosticGroup, EnrichedDiagnosticMetric } from '@/types/diagnostics';
// Utils
import DefaultMap from '@/utils/defaultMap';
import { isNumber } from '@/utils/pathologyUtils';

const getFormattedDiagnosticValue = (segment: any) => {
  const res = segment.get('OBX.5');
  if (res !== null && typeof res === 'object') {
    // This merges fields 1 and 2 of the OBX.5 segment when they are like "<" and "5.2"
    return segment.get('OBX.5.1') + ' ' + segment.get('OBX.5.2');
  }
  return isNumber(res) ? res : null;
};

// TODO: Make this function simpler. We can potentially split it into steps, or use reducers
export const getEnrichedDiagnosticGroups = (
  hl7Parser: any,
  diagnosticLookup: DiagnosticLookup,
  conditionLookup: ConditionLookup,
  age: number,
  gender: 'Male' | 'Female'
): DiagnosticGroup[] => {
  // This data structure represents the diagnostic groups and their diagnostics, and each diagnostic's metrics
  const tempDiagnosticGroups = new DefaultMap<
    string,
    DefaultMap<string, EnrichedDiagnosticMetric[]>
  >(() => new DefaultMap<string, EnrichedDiagnosticMetric[]>(() => []));

  hl7Parser.getSegments('OBX').forEach((segment: any) => {
    const oruSonicCode = segment.get('OBX.3.2');
    // Currently using CWE.1 which is the identifier. Need to check if the oru_sonic_unit in the diagnostic metric is referring to the identifier as well
    const oruSonicUnits = segment.get('OBX.6.1');
    const diagnosticMetric = diagnosticLookup.getDiagnosticMetric(
      oruSonicCode,
      oruSonicUnits,
      age,
      gender
    );
    if (diagnosticMetric?.diagnostic_groups && diagnosticMetric.diagnostic) {
      const patientValue = getFormattedDiagnosticValue(segment);
      if (patientValue === null) {
        return;
      }
      tempDiagnosticGroups
        .get(diagnosticMetric.diagnostic_groups)
        .get(diagnosticMetric.diagnostic)
        .push({
          name: diagnosticMetric.name,
          diagnosticGroup: diagnosticMetric.diagnostic_groups,
          diagnostic: diagnosticMetric.diagnostic,
          patientValue: patientValue,
          everlabLower: diagnosticMetric.everlab_lower,
          everlabHigher: diagnosticMetric.everlab_higher,
          unit: diagnosticMetric.units,
          minAge: diagnosticMetric.min_age,
          maxAge: diagnosticMetric.max_age,
          potentialConditions: conditionLookup.getConditions(
            diagnosticMetric.name
          )
        });
    }
  });

  const diagnosticGroups: DiagnosticGroup[] = [];

  // This is the final data structure that will be returned
  for (const [
    diagnosticGroupName,
    diagnostics
  ] of tempDiagnosticGroups.entries()) {
    const diagnosticGroup: DiagnosticGroup = {
      name: diagnosticGroupName,
      diagnostics: []
    };

    for (const [diagnostic, diagnosticMetrics] of diagnostics.entries()) {
      diagnosticGroup.diagnostics.push({
        name: diagnostic,
        metrics: diagnosticMetrics
      });
    }

    diagnosticGroups.push(diagnosticGroup);
  }
  return diagnosticGroups;
};
