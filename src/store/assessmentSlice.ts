import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  timeLimit: number;
  memoryLimit: number;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  constraints: string[];
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];
  timeComplexity: string;
  spaceComplexity: string;
}

interface AssessmentState {
  currentProblem: Problem | null;
  selectedLanguage: string;
  timeRemaining: number;
  isActive: boolean;
  submissions: any[];
  testResults: any[];
  score: number;
  theme: 'light' | 'dark';
}

const sampleProblem: Problem = {
  id: '1',
  title: 'Two Sum',
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  difficulty: 'Easy',
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.'
  ],
  inputFormat: 'First line contains the array length n, followed by n integers representing the array, then the target integer.',
  outputFormat: 'Two space-separated integers representing the indices of the two numbers.',
  sampleInput: '4\n2 7 11 15\n9',
  sampleOutput: '0 1',
  testCases: [
    {
      id: '1',
      input: '4\n2 7 11 15\n9',
      expectedOutput: '0 1',
      isHidden: false,
      timeLimit: 1000,
      memoryLimit: 128
    },
    {
      id: '2',
      input: '3\n3 2 4\n6',
      expectedOutput: '1 2',
      isHidden: true,
      timeLimit: 1000,
      memoryLimit: 128
    }
  ],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)'
};

const initialState: AssessmentState = {
  currentProblem: sampleProblem,
  selectedLanguage: 'javascript',
  timeRemaining: 3600, // 1 hour in seconds
  isActive: true,
  submissions: [],
  testResults: [],
  score: 0,
  theme: 'light',
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload;
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    addSubmission: (state, action: PayloadAction<any>) => {
      state.submissions.push(action.payload);
    },
    setTestResults: (state, action: PayloadAction<any[]>) => {
      state.testResults = action.payload;
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
  },
});

export const {
  setLanguage,
  setTimeRemaining,
  toggleTheme,
  addSubmission,
  setTestResults,
  updateScore,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;