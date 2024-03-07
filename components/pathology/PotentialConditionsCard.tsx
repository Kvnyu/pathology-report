// External modules
import { RiAlertFill } from '@remixicon/react';
import { Card, Icon } from '@tremor/react';
// Internal
import { BasicTable, BasicTableColumn } from '../ui/BasicTable';
// Utils
import { AbnormalDiagnosticGroup } from '@/utils/pathologyUtils';

const columns: BasicTableColumn<AbnormalDiagnosticGroup>[] = [
  {
    label: 'Diagnostic Group',
    renderCell: (diagnosticGroup: AbnormalDiagnosticGroup) => (
      <label>{diagnosticGroup.name}</label>
    ),
    getKey: (diagnosticGroup: AbnormalDiagnosticGroup) => diagnosticGroup.name
  },
  {
    label: 'Conditions',
    renderCell: (diagnosticGroup: AbnormalDiagnosticGroup) => (
      <ul className="list-disc list-inside">
        {diagnosticGroup.conditions.map((condition) => (
          <li key={condition} className="text-wrap whitespace-normal">
            {condition}
          </li>
        ))}
      </ul>
    ),
    getKey: (diagnosticGroup: AbnormalDiagnosticGroup) =>
      `${diagnosticGroup.name}-conditions`
  }
];

interface PotentialConditionsCardProps {
  abnormalDiagnosticGroups: AbnormalDiagnosticGroup[];
}

// TODO: Make a view button that opens up the diagnostic group in the table
const PotentialConditionsCard = ({
  abnormalDiagnosticGroups
}: PotentialConditionsCardProps) => (
  <Card className="mx-auto col-span-2 flex flex-col gap-2">
    <div className="flex gap-4 items-center">
      <Icon icon={RiAlertFill} variant="light" size="md" color="orange" />
      <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Potential conditions
      </h3>
    </div>
    <div className="text-sm mt-2">
      Detected potential conditions from the following diagnostic groups:
    </div>
    {abnormalDiagnosticGroups.map((diagnosticGroup) => {
      return (
        <BasicTable
          key={diagnosticGroup.name}
          columns={columns}
          data={[diagnosticGroup]}
          name={diagnosticGroup.name}
          className="border rounded-md"
        />
      );
    })}
  </Card>
);
export default PotentialConditionsCard;
