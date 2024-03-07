// Types
import { PatientInformation } from '@/types/patient';
// Utils
import { calculateAge } from '@/utils/dateUtils';
import { oruToMetricGender } from '@/utils/pathologyUtils';

export const extractPatientIdentification = (
  hl7Parser: any
): PatientInformation => {
  const dob = hl7Parser.get('PID.7');

  return {
    id: hl7Parser.get('PID.2'),
    name: `${hl7Parser.get('PID.5.5')} ${hl7Parser.get(
      'PID.5.2'
    )} ${hl7Parser.get('PID.5.1')}`,
    dob: dob,
    age: calculateAge(dob),
    sex: oruToMetricGender[hl7Parser.get('PID.8') as 'M' | 'F'],
    address: hl7Parser.get('PID.11'),
    phoneNumber: getFormattedPhoneNumber(hl7Parser)
  };
};

const getFormattedPhoneNumber = (hl7Parser: any) => {
  return `${hl7Parser.get('PID.13.5')} ${hl7Parser.get(
    'PID.13.6'
  )} ${hl7Parser.get('PID.13.7')}`.trim();
};
