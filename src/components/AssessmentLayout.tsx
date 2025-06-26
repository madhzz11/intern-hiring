import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ProblemStatement from './ProblemStatement';
import CodeEditor from './editor/CodeEditor';
import TestPanel from './TestPanel';
import SubmissionPanel from './SubmissionPanel';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

const AssessmentLayout: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.assessment);

  return (
    <div className={`h-[calc(100vh-4rem)] ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <PanelGroup direction="horizontal">
        {/* Left Panel - Problem Statement */}
        <Panel defaultSize={35} minSize={25}>
          <div className={`h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <ProblemStatement />
          </div>
        </Panel>

        <PanelResizeHandle className={`w-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors cursor-col-resize`} />

        {/* Right Panel - Code Editor and Results */}
        <Panel defaultSize={65} minSize={40}>
          <PanelGroup direction="vertical">
            {/* Code Editor */}
            <Panel defaultSize={70} minSize={50}>
              <div className="h-full">
                <CodeEditor />
              </div>
            </Panel>

            <PanelResizeHandle className={`h-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors cursor-row-resize`} />

            {/* Bottom Panel - Tests and Submission */}
            <Panel defaultSize={30} minSize={20}>
              <PanelGroup direction="horizontal">
                <Panel defaultSize={60}>
                  <TestPanel />
                </Panel>

                <PanelResizeHandle className={`w-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />

                <Panel defaultSize={40}>
                  <SubmissionPanel />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default AssessmentLayout;