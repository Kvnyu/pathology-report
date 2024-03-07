// External modules
import { Text, MarkerBar, Divider, Legend } from '@tremor/react';
// Components
import { BasicTable, BasicTableColumn } from '@/components/ui/BasicTable';
// Utils
import {
  isMetricAbnormal,
  normalisePatientValue
} from '@/utils/pathologyUtils';
// Types
import {
  Diagnostic,
  DiagnosticGroup,
  EnrichedDiagnosticMetric
} from '@/types/diagnostics';

const columns: BasicTableColumn<EnrichedDiagnosticMetric>[] = [
  {
    label: 'Diagnostic Metric',
    renderCell: (metric: EnrichedDiagnosticMetric) => (
      <div className="flex gap-2">
        {isMetricAbnormal(metric) && (
          <div className="bg-red-500 w-1 shrink-0 rounded"></div>
        )}
        {metric.name}
      </div>
    ),
    getKey: (metric: EnrichedDiagnosticMetric) => metric.name
  },
  {
    label: '',
    renderCell: (metric: EnrichedDiagnosticMetric) => (
      <>{metric.everlabHigher && <MarkerBarVisual metric={metric} />}</>
    ),
    getKey: (metric: EnrichedDiagnosticMetric) => `${metric.name}-marker`
  },
  {
    label: 'Patient Value',
    renderCell: (metric: EnrichedDiagnosticMetric) => (
      <MeasurementText value={metric.patientValue} unit={metric.unit} />
    ),
    getKey: (metric: EnrichedDiagnosticMetric) => `${metric.name}-patient-value`
  },
  {
    label: 'Lower range',
    renderCell: (metric: EnrichedDiagnosticMetric) => (
      <MeasurementText value={metric.everlabLower} unit={metric.unit} />
    ),
    getKey: (metric: EnrichedDiagnosticMetric) => `${metric.name}-lower-range`
  },
  {
    label: 'Upper range',
    renderCell: (metric: EnrichedDiagnosticMetric) => (
      <MeasurementText value={metric.everlabHigher} unit={metric.unit} />
    ),
    getKey: (metric: EnrichedDiagnosticMetric) => `${metric.name}-upper-range`
  }
];

interface DiagnosticTableProps {
  diagnosticGroup: DiagnosticGroup;
}

const DiagnosticTable = ({ diagnosticGroup }: DiagnosticTableProps) => {
  return (
    <>
      {diagnosticGroup.diagnostics.map(
        (diagnostic: Diagnostic, index: number) => (
          <div className="grid gap-1 mt-3" key={diagnostic.name}>
            <Text className="text-[16px]">{diagnostic.name}</Text>
            <BasicTable
              columns={columns}
              data={diagnostic.metrics}
              name={diagnostic.name}
              className="border rounded-md"
            />
            {index !== diagnosticGroup.diagnostics.length - 1 && <Divider />}
          </div>
        )
      )}
      <div className="flex w-full justify-end">
        <Legend
          className="mt-3"
          categories={['Normal', 'Abnormal']}
          colors={['emerald', 'red']}
        />
      </div>
    </>
  );
};

const MarkerBarVisual = ({ metric }: { metric: EnrichedDiagnosticMetric }) => {
  const {
    everlabLower,
    everlabHigher,
    patientValue: rawPatientValue,
    unit
  } = metric;
  const patientValue = normalisePatientValue(rawPatientValue);
  // The maximum value is scaled based on the healthy maximum. It would be better if there were more exact
  // custom values for each metric. We could also change the maxValue calculation to be based on the maximum
  const maxValue = 75;
  const virtualMax = everlabHigher
    ? (everlabHigher * 100) / maxValue
    : patientValue * 2;
  // If there is no minimum value, it is taken to be 0
  const minValue = everlabLower
    ? Math.max((everlabLower / virtualMax) * 100, 0)
    : 0;
  const value = Math.min((patientValue / virtualMax) * 100, 100);
  // TODO: Account for cases when there is only a lower limit
  return (
    <MarkerBar
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      color={isMetricAbnormal(metric) ? 'red' : 'green'}
      markerTooltip={`${patientValue} ${unit}`}
      className="mt-3 min-w-[120px]"
    />
  );
};

const MeasurementText = ({
  value,
  unit
}: {
  value?: string | number;
  unit?: string;
}) => {
  if (value === undefined || value === null) {
    return '-';
  }
  if (!unit) {
    return value;
  }
  return `${value} ${unit}`;
};

export default DiagnosticTable;
