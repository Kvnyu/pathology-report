import { useCallback, useMemo, useRef } from 'react';
// External modules
import {
  RiAlertFill,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckFill
} from '@remixicon/react';
import {
  Icon,
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@tremor/react';
// Components
import DiagnosticGroupView from '@/components/pathology/DiagnosticGroupView';
// Utils
import { AbnormalDiagnosticGroup } from '@/utils/pathologyUtils';
// Types
import { DiagnosticGroup } from '@/types/diagnostics';

interface DiagnosticGroupsContainerProps {
  diagnosticGroups: DiagnosticGroup[];
  abnormalDiagnosticGroups: AbnormalDiagnosticGroup[];
}

const DiagnosticGroupsContainer = ({
  diagnosticGroups,
  abnormalDiagnosticGroups
}: DiagnosticGroupsContainerProps) => {
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (tablistRef.current) {
      tablistRef.current.scrollBy({
        left: direction === 'left' ? 300 : -300,
        behavior: 'smooth'
      });
    }
  }, []);

  const abnormalDiagnosticGroupsLookup: { [key: string]: AbnormalDiagnosticGroup } = useMemo(() => {
    return abnormalDiagnosticGroups.reduce((acc, abnormalDiagnosticGroup) => {
      return {
        ...acc,
        [abnormalDiagnosticGroup.name]: abnormalDiagnosticGroup
      }
    }, {})
  }, [abnormalDiagnosticGroups]);

  // This is used to perform a quick lookup to check if a diagnostic group is abnormal
  const isDiagnosticGroupAbnormal = useCallback(
    (diagnosticGroupName: string) => {
      return !!abnormalDiagnosticGroupsLookup[diagnosticGroupName];
    },
    [abnormalDiagnosticGroupsLookup]
  );

  return (
    <Card className="mx-auto w-full">
      <TabGroup>
        <TabList>
          <div
            className="flex overflow-x-auto overflow-y-clip mx-10 hidden-scrollbar"
            ref={tablistRef}
          >
            <div className="flex gap-1">
              {diagnosticGroups.map((diagnosticGroup: DiagnosticGroup) => (
                <Tab key={diagnosticGroup.name}>
                  <div className="flex items-center">
                    <Icon
                      icon={
                        isDiagnosticGroupAbnormal(diagnosticGroup.name)
                          ? RiAlertFill
                          : RiCheckFill
                      }
                      variant="simple"
                      size="sm"
                      color={
                        isDiagnosticGroupAbnormal(diagnosticGroup.name)
                          ? 'orange'
                          : 'green'
                      }
                      className="mr-1"
                    />
                    {diagnosticGroup.name}
                  </div>
                </Tab>
              ))}
            </div>
            <button
              className="absolute left-8 top-8 cursor-pointer"
              onClick={() => handleScroll('right')}
            >
              <Icon
                icon={RiArrowLeftLine}
                variant="simple"
                size="sm"
                color="gray"
              />
            </button>
            <button
              className="absolute right-8 top-8 cursor-pointer"
              onClick={() => handleScroll('left')}
            >
              <Icon
                icon={RiArrowRightLine}
                variant="simple"
                size="sm"
                color="gray"
              />
            </button>
          </div>
        </TabList>
        <TabPanels>
          {diagnosticGroups.map((diagnosticGroup: DiagnosticGroup) => {
            return (
              <TabPanel
                key={diagnosticGroup.name}
                className="p-2"
                id={diagnosticGroup.name}
              >
                <DiagnosticGroupView
                  key={diagnosticGroup.name}
                  diagnosticGroup={diagnosticGroup}
                  isAbnormal={isDiagnosticGroupAbnormal(diagnosticGroup.name)}
                  potentialConditions={abnormalDiagnosticGroupsLookup[diagnosticGroup.name]?.conditions || []}
                />
              </TabPanel>
            );
          })}
        </TabPanels>
      </TabGroup>
    </Card>
  );
};

export default DiagnosticGroupsContainer;
