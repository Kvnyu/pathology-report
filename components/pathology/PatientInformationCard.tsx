// External modules
import { RiUserFill } from '@remixicon/react';
import { Card, Icon, List, ListItem } from '@tremor/react';
// Types
import { PatientInformation } from '@/types/patient';

interface PatientInformationCardProps {
  patientInformation: PatientInformation;
}

const PatientInformationCard = ({
  patientInformation
}: PatientInformationCardProps) => (
  <Card className="mx-auto col-span-2 md:col-span-1">
    <div className="flex gap-4 items-center">
      <Icon icon={RiUserFill} variant="light" tooltip="light" size="md" />
      <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Patient
      </h3>
    </div>
    <List className="mt-2">
      <ListItem>
        <span>Name</span>
        <span>{patientInformation.name}</span>
      </ListItem>
      <ListItem>
        <span>Age</span>
        <span>{patientInformation.age}</span>
      </ListItem>
      <ListItem>
        <span>Sex</span>
        <span>{patientInformation.sex}</span>
      </ListItem>
      <ListItem>
        <span>Phone number</span>
        <span>{patientInformation.phoneNumber}</span>
      </ListItem>
    </List>
  </Card>
);

export default PatientInformationCard;
