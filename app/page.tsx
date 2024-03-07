'use client';
import { useCallback, useMemo, useState } from 'react';
// External modules
import { Divider, Callout } from '@tremor/react';
// Components
import FileUploadButton from '@/components/ui/FileUploadButton';
import AbnormalitiesCard from '@/components/pathology/PotentialConditionsCard';
import PatientInformationCard from '@/components/pathology/PatientInformationCard';
import DiagnosticGroupsContainer from '@/components/pathology/DiagnosticsGroupsContainer';
// Types
import { DiagnosticGroup } from '@/types/diagnostics';
import { PatientInformation } from '@/types/patient';
// Utils
import {
  AbnormalDiagnosticGroup,
  getAbnormalDiagnosticGroups
} from '@/utils/pathologyUtils';
// Services
import { uploadPathologyReport } from '@/services/pathologyService';

export default function Page() {
  const [diagnosticGroups, setDiagnosticGroups] = useState<DiagnosticGroup[]>([]);

  const [patientInformation, setPatientInformation] =
    useState<PatientInformation>();

  const abnormalDiagnosticGroups = useMemo(
    () => getAbnormalDiagnosticGroups(diagnosticGroups),
    [diagnosticGroups]
  );

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const response = await uploadPathologyReport(file);
      if (response) {
        const abnormalDiagnosticGroups = getAbnormalDiagnosticGroups(
          response.data.diagnosticGroups
        );

        const sortedDiagnosticGroups = response.data.diagnosticGroups.toSorted(
          (a: DiagnosticGroup, b: DiagnosticGroup) => {
            const valueA = abnormalDiagnosticGroups.find(
              (v: AbnormalDiagnosticGroup) => v.name === a.name
            )
              ? 1
              : 0;
            const valueB = abnormalDiagnosticGroups.find(
              (v: AbnormalDiagnosticGroup) => v.name === b.name
            )
              ? 1
              : 0;
            return valueB - valueA;
          }
        );

        // Sort the diagnostic groups, show the abnormal ones first
        setDiagnosticGroups(sortedDiagnosticGroups);
        setPatientInformation(response.data.patientInformation);
      }
    } catch (e) {
      console.error(e);
      // TODO: Add error state handling here, this should display an error state
    }
  }, []);

  return (
    <main className="flex flex-col p-4 md:p-10 mx-auto max-w-7xl gap-3 w-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Pathology Reports</h1>
        <FileUploadButton onFileSelect={handleFileSelect}>
          New Report
        </FileUploadButton>
      </div>

      <Divider />

      {diagnosticGroups.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {patientInformation && (
              <PatientInformationCard patientInformation={patientInformation} />
            )}
            {abnormalDiagnosticGroups.length > 0 && (
              <AbnormalitiesCard
                abnormalDiagnosticGroups={abnormalDiagnosticGroups}
              />
            )}
          </div>
          <DiagnosticGroupsContainer
            diagnosticGroups={diagnosticGroups}
            abnormalDiagnosticGroups={abnormalDiagnosticGroups}
          />
        </>
      ) : (
        <Callout title="Interpret a pathology report" color="blue">
          To interpret a pathology report, click the{' '}
          <span className="font-bold">New Report</span> button above and upload
          a file (It should be in HL7/ORU format).
        </Callout>
      )}
    </main>
  );
}
