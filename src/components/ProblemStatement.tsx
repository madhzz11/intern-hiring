import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Clock, Target, Zap, Database, CheckCircle, AlertCircle } from 'lucide-react';

const ProblemStatement: React.FC = () => {
  const { currentProblem, theme } = useSelector((state: RootState) => state.assessment);

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>No problem loaded</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'Medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'Hard': return 'text-red-500 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {currentProblem.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentProblem.difficulty)}`}>
              {currentProblem.difficulty}
            </span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="space-y-4">
          <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
            <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line selectable`}>
              {currentProblem.description}
            </div>
          </div>
        </div>

        {/* Input/Output Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Input Format
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} selectable`}>
              {currentProblem.inputFormat}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Output Format
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} selectable`}>
              {currentProblem.outputFormat}
            </p>
          </div>
        </div>

        {/* Sample Input/Output */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Sample Test Case
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Input
              </h4>
              <pre className={`p-3 rounded-md text-sm font-mono ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'} selectable`}>
                {currentProblem.sampleInput}
              </pre>
            </div>
            <div>
              <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Output
              </h4>
              <pre className={`p-3 rounded-md text-sm font-mono ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'} selectable`}>
                {currentProblem.sampleOutput}
              </pre>
            </div>
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Constraints
          </h3>
          <ul className="space-y-2">
            {currentProblem.constraints.map((constraint, index) => (
              <li key={index} className={`flex items-start space-x-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="selectable">{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Complexity Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Complexity
              </h4>
            </div>
            <p className={`text-sm font-mono ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} selectable`}>
              {currentProblem.timeComplexity}
            </p>
          </div>
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-4 w-4 text-purple-500" />
              <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Space Complexity
              </h4>
            </div>
            <p className={`text-sm font-mono ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} selectable`}>
              {currentProblem.spaceComplexity}
            </p>
          </div>
        </div>

        {/* Scoring Criteria */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Scoring Criteria
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>40%</div>
              <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Correctness</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>25%</div>
              <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Performance</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>20%</div>
              <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Code Quality</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>15%</div>
              <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Edge Cases</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;