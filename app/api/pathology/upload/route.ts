// External modules
import { NextRequest, NextResponse } from 'next/server';
// Internal modules
import { initConditionLookup, initDiagnosticLookup } from './lookupStructures';
import { extractPatientIdentification } from './patientInformation';
import { getEnrichedDiagnosticGroups } from './diagnosticGroups';
// Utils
import { initHL7Parser } from '@/utils/pathologyUtils';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({
      error: {
        code: 400,
        message: 'Could not read uploaded file'
      }
    });
  }

  const hl7FileText = await file.text();
  const hl7Parser = initHL7Parser(hl7FileText);
  if (!hl7Parser) {
    return NextResponse.json({
      error: {
        code: 500,
        message: 'Error parsing the file'
      }
    });
  }

  // Initialise the data structure for fast diagnostic metric lookups
  const diagnosticLookup = await initDiagnosticLookup();
  if (!diagnosticLookup) {
    return NextResponse.json({
      error: {
        code: 500,
        message: 'Error reading the diagnostic metrics'
      }
    });
  }

  // Initialise the data structure for fast diagnostic metric lookups
  const conditionLookup = await initConditionLookup();
  if (!conditionLookup) {
    return NextResponse.json({
      error: {
        code: 500,
        message: 'Error reading the conditions'
      }
    });
  }

  const patientInformation = extractPatientIdentification(hl7Parser);

  // Get the diagnostic groups for the patient with data enriched from the HL7 file
  const diagnosticGroups = getEnrichedDiagnosticGroups(
    hl7Parser,
    diagnosticLookup,
    conditionLookup,
    patientInformation.age,
    patientInformation.sex
  );

  return NextResponse.json({ data: { patientInformation, diagnosticGroups } });
}
