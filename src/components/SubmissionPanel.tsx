import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addSubmission, updateScore } from '../store/assessmentSlice';
import { Send, Award, TrendingUp, Clock, Zap, Code, CheckCircle, AlertCircle } from 'lucide-react';

interface SubmissionResult {
  id: string;
  timestamp: string;
  code: string;
  language: string;
  score: number;
  testsPassed: number;
  totalTests: number;
  executionTime: number;
  memoryUsed: number;
  codeQuality: number;
  feedback: string[];
}

const SubmissionPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<SubmissionResult | null>(null);
  
  const { code } = useSelector((state: RootState) => state.editor);
  const { selectedLanguage, submissions, score, theme } = useSelector((state: RootState) => state.assessment);

  const analyzeSubmission = (code: string, language: string): SubmissionResult => {
    // Simulate comprehensive code analysis
    const codeLines = code.split('\n').filter(line => line.trim().length > 0).length;
    const hasComments = code.includes('//') || code.includes('#') || code.includes('/*');
    const hasProperStructure = code.includes('function') || code.includes('def') || code.includes('public');
    const hasOptimalSolution = code.includes('Map') || code.includes('HashMap') || code.includes('dict');
    
    // Calculate code quality score
    let qualityScore = 0;
    if (hasProperStructure) qualityScore += 25;
    if (hasComments) qualityScore += 15;
    if (hasOptimalSolution) qualityScore += 30;
    if (codeLines > 5 && codeLines < 50) qualityScore += 20;
    if (code.includes('return')) qualityScore += 10;
    
    // Simulate test results
    const totalTests = 10;
    const testsPassed = Math.floor(Math.random() * 3) + 7; // 7-10 tests passed
    const correctnessScore = (testsPassed / totalTests) * 40;
    
    // Performance score (simulated)
    const performanceScore = Math.random() * 25 + 15; // 15-40 points
    
    // Edge cases score
    const edgeCasesScore = Math.random() * 15 + 5; // 5-20 points
    
    const totalScore = Math.min(100, correctnessScore + performanceScore + (qualityScore * 0.2) + edgeCasesScore);
    
    const feedback = [];
    if (testsPassed === totalTests) {
      feedback.push('✅ All test cases passed successfully!');
    } else {
      feedback.push(`⚠️ ${totalTests - testsPassed} test case(s) failed. Check edge cases.`);
    }
    
    if (qualityScore > 70) {
      feedback.push('👍 Excellent code structure and readability.');
    } else if (qualityScore > 40) {
      feedback.push('💡 Good solution, consider adding comments for better readability.');
    } else {
      feedback.push('📝 Consider improving code structure and adding proper documentation.');
    }
    
    if (hasOptimalSolution) {
      feedback.push('🚀 Optimal time complexity detected - great job!');
    } else {
      feedback.push('⏰ Consider optimizing for better time complexity.');
    }

    return {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      code,
      language,
      score: Math.round(totalScore),
      testsPassed,
      totalTests,
      executionTime: Math.random() * 500 + 100,
      memoryUsed: Math.random() * 30 + 15,
      codeQuality: qualityScore,
      feedback,
    };
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = analyzeSubmission(code, selectedLanguage);
    setLastSubmission(result);
    
    dispatch(addSubmission(result));
    dispatch(updateScore(result.score));
    
    setIsSubmitting(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return theme === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200';
    if (score >= 60) return theme === 'dark' ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
    return theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200';
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Submission
        </h3>
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Attempts: {submissions.length}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !code.trim()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isSubmitting || !code.trim()
                ? theme === 'dark'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
            }`}
          >
            <Send className="h-5 w-5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
          </button>
          
          {!code.trim() && (
            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Write some code before submitting
            </p>
          )}
        </div>

        {/* Current Score */}
        {score > 0 && (
          <div className={`p-4 rounded-lg border ${getScoreBackground(score)}`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className={`h-6 w-6 ${getScoreColor(score)}`} />
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}/100
                </span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Current Best Score
              </p>
            </div>
          </div>
        )}

        {/* Last Submission Results */}
        {lastSubmission && (
          <div className="space-y-4">
            <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Latest Submission Results
            </h4>
            
            {/* Score Breakdown */}
            <div className={`p-4 rounded-lg border ${getScoreBackground(lastSubmission.score)}`}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-xl font-bold ${getScoreColor(lastSubmission.score)}`}>
                    {lastSubmission.score}/100
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Score
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${
                    lastSubmission.testsPassed === lastSubmission.totalTests ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {lastSubmission.testsPassed}/{lastSubmission.totalTests}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tests Passed
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lastSubmission.executionTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Execution
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lastSubmission.memoryUsed.toFixed(1)}MB
                    </span>
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Memory
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Code className="h-4 w-4 text-indigo-500" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lastSubmission.codeQuality}/100
                    </span>
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quality
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h5 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Detailed Feedback
              </h5>
              <div className="space-y-2">
                {lastSubmission.feedback.map((item, index) => (
                  <div key={index} className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-start space-x-2`}>
                    <span className="mt-0.5">•</span>
                    <span className="selectable">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Timestamp */}
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
              Submitted at {new Date(lastSubmission.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {/* Submission History */}
        {submissions.length > 0 && (
          <div className="space-y-3">
            <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Submission History
            </h4>
            <div className="space-y-2">
              {submissions.slice(-3).reverse().map((submission: any, index) => (
                <div key={submission.id} className={`p-3 rounded border ${
                  theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {submission.score >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Attempt #{submissions.length - index}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${getScoreColor(submission.score)}`}>
                        {submission.score}/100
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({submission.testsPassed}/{submission.totalTests} tests)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionPanel;