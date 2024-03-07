export type Gender = 'Any' | 'Male' | 'Female';

export interface PatientInformation {
  id: string;
  name: string;
  dob: string;
  age: number;
  sex: 'Male' | 'Female';
  address: string[];
  phoneNumber: string;
}
