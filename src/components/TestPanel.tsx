import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setExecuting, setOutput, setErrors } from '../store/editorSlice';
import { setTestResults } from '../store/assessmentSlice';
import { Play, CheckCircle, XCircle, Clock, Zap, AlertTriangle } from 'lucide-react';

interface TestResult {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

const TestPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'sample' | 'custom' | 'results'>('sample');
  
  const { code, isExecuting, output } = useSelector((state: RootState) => state.editor);
  const { currentProblem, selectedLanguage, testResults, theme } = useSelector((state: RootState) => state.assessment);

  const simulateCodeExecution = async (input: string, expectedOutput?: string): Promise<TestResult> => {
    // Simulate code execution delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Simulate different outcomes based on code content
    const codeQuality = analyzeCode(code);
    const isCorrect = Math.random() > 0.3 && codeQuality > 0.5; // Simulate success rate
    
    // For demo purposes, we'll simulate the Two Sum problem solution
    let actualOutput = '';
    let error = '';
    
    if (selectedLanguage === 'javascript' && code.includes('twoSum')) {
      // Simulate actual execution for Two Sum
      if (input.includes('2 7 11 15') && input.includes('9')) {
        actualOutput = '0 1';
      } else if (input.includes('3 2 4') && input.includes('6')) {
        actualOutput = '1 2';
      } else {
        actualOutput = isCorrect ? (expectedOutput || '0 1') : 'undefined undefined';
      }
    } else {
      actualOutput = isCorrect ? (expectedOutput || 'Sample output') : 'Error: compilation failed';
      if (!isCorrect) {
        error = 'Runtime error: Cannot read property of undefined';
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      input,
      expectedOutput: expectedOutput || '',
      actualOutput,
      passed: isCorrect && actualOutput === (expectedOutput || actualOutput),
      executionTime: Math.random() * 800 + 100,
      memoryUsed: Math.random() * 50 + 20,
      error: error || undefined,
    };
  };

  const analyzeCode = (code: string): number => {
    let score = 0;
    
    // Check for basic structure
    if (code.includes('function') || code.includes('def') || code.includes('public')) score += 0.3;
    
    // Check for loops/iterations
    if (code.includes('for') || code.includes('while') || code.includes('forEach')) score += 0.2;
    
    // Check for data structures
    if (code.includes('Map') || code.includes('Set') || code.includes('dict') || code.includes('HashMap')) score += 0.3;
    
    // Check for return statements
    if (code.includes('return')) score += 0.2;
    
    return Math.min(score, 1);
  };

  const runSampleTests = async () => {
    if (!currentProblem) return;
    
    dispatch(setExecuting(true));
    dispatch(setOutput('Running tests...'));
    
    const results: TestResult[] = [];
    
    for (const testCase of currentProblem.testCases) {
      const result = await simulateCodeExecution(testCase.input, testCase.expectedOutput);
      results.push(result);
    }
    
    dispatch(setTestResults(results));
    dispatch(setExecuting(false));
    setActiveTab('results');
    
    const passedTests = results.filter(r => r.passed).length;
    dispatch(setOutput(`Tests completed: ${passedTests}/${results.length} passed`));
  };

  const runCustomTest = async () => {
    if (!customInput.trim()) return;
    
    dispatch(setExecuting(true));
    dispatch(setOutput('Running custom test...'));
    
    const result = await simulateCodeExecution(customInput);
    dispatch(setOutput(result.actualOutput || result.error || 'No output'));
    dispatch(setExecuting(false));
  };

  const getTestStatusIcon = (result: TestResult) => {
    if (result.passed) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('sample')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeTab === 'sample'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sample Tests
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeTab === 'custom'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Custom Test
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              activeTab === 'results'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Results {testResults.length > 0 && `(${testResults.filter(r => r.passed).length}/${testResults.length})`}
          </button>
        </div>

        <button
          onClick={runSampleTests}
          disabled={isExecuting}
          className={`flex items-center space-x-2 px-4 py-1 rounded text-sm transition-colors ${
            isExecuting
              ? theme === 'dark'
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : theme === 'dark'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <Play className="h-4 w-4" />
          <span>{isExecuting ? 'Running...' : 'Run Tests'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'sample' && (
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Sample Test Cases
            </h3>
            {currentProblem?.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
              <div key={testCase.id} className={`p-3 rounded-lg border ${
                theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Test Case {index + 1}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Input:
                    </div>
                    <pre className={`text-xs p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'} selectable`}>
                      {testCase.input}
                    </pre>
                  </div>
                  <div>
                    <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Expected Output:
                    </div>
                    <pre className={`text-xs p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'} selectable`}>
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Custom Test
            </h3>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Input:
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={4}
                className={`w-full p-2 rounded border text-sm font-mono resize-none ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter your test input here..."
              />
            </div>
            <button
              onClick={runCustomTest}
              disabled={isExecuting || !customInput.trim()}
              className={`flex items-center space-x-2 px-4 py-2 rounded text-sm transition-colors ${
                isExecuting || !customInput.trim()
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Play className="h-4 w-4" />
              <span>{isExecuting ? 'Running...' : 'Run Custom Test'}</span>
            </button>
            
            {output && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Output:
                </label>
                <pre className={`w-full p-2 rounded border text-sm font-mono ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'
                } selectable`}>
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Test Results
              </h3>
              {testResults.length > 0 && (
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {testResults.filter(r => r.passed).length}/{testResults.length} passed
                </div>
              )}
            </div>
            
            {testResults.length === 0 ? (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>No test results yet. Run some tests to see results here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={result.id} className={`p-3 rounded-lg border ${
                    result.passed
                      ? theme === 'dark' ? 'border-green-700 bg-green-900/20' : 'border-green-200 bg-green-50'
                      : theme === 'dark' ? 'border-red-700 bg-red-900/20' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getTestStatusIcon(result)}
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Test Case {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Clock className="h-3 w-3" />
                          <span>{result.executionTime.toFixed(0)}ms</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Zap className="h-3 w-3" />
                          <span>{result.memoryUsed.toFixed(1)}MB</span>
                        </div>
                      </div>
                    </div>
                    
                    {result.error && (
                      <div className="mb-2">
                        <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                          Error:
                        </div>
                        <pre className={`text-xs p-2 rounded ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'} selectable`}>
                          {result.error}
                        </pre>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Expected:
                        </div>
                        <pre className={`text-xs p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'} selectable`}>
                          {result.expectedOutput}
                        </pre>
                      </div>
                      <div>
                        <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Actual:
                        </div>
                        <pre className={`text-xs p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'} selectable`}>
                          {result.actualOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPanel;