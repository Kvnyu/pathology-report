// External modules
import { RiAlarmWarningLine } from '@remixicon/react';
import { Title, Callout } from '@tremor/react';
// Internal modules
import DiagnosticTable from './DiagnosticTable';
// Types
import { DiagnosticGroup } from '@/types/diagnostics';

interface DiagnosticGroupViewProps {
	diagnosticGroup: DiagnosticGroup;
	isAbnormal: boolean;
	potentialConditions?: string[];
}

const DiagnosticGroupView = ({
	diagnosticGroup,
	potentialConditions
}: DiagnosticGroupViewProps) => {
	return (
		<>
			<div className="flex mt-2 gap-4">
				<Title>{diagnosticGroup.name}</Title>
			</div>
			{potentialConditions && potentialConditions.length > 0 && (
				<Callout
					title={'Potential Conditions'}
					className="mt-5"
					color="orange"
					icon={RiAlarmWarningLine}
				>
					{potentialConditions.map((condition: string) => (
						<span key={condition}>
							&bull; {condition}
							<br />
						</span>
					))}
					<br />
					<span className="font-semibold">See below</span> for abnormal
					diagnostic metrics
				</Callout>
			)}
			<DiagnosticTable diagnosticGroup={diagnosticGroup} />
		</>
	);
};

export default DiagnosticGroupView;
