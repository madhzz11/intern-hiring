import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  code: string;
  fontSize: number;
  theme: string;
  isExecuting: boolean;
  output: string;
  errors: string[];
  lastSaved: string | null;
  hasUnsavedChanges: boolean;
}

const getDefaultCode = (language: string): string => {
  const templates: Record<string, string> = {
    javascript: `// Two Sum Solution
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Read input
const input = readline().split('\\n');
const n = parseInt(input[0]);
const nums = input[1].split(' ').map(Number);
const target = parseInt(input[2]);

// Solve and output
const result = twoSum(nums, target);
console.log(result.join(' '));`,
    
    python: `# Two Sum Solution
def two_sum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []

# Read input
n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# Solve and output
result = two_sum(nums, target)
print(' '.join(map(str, result)))`,
    
    java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            
            map.put(nums[i], i);
        }
        
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        int n = scanner.nextInt();
        int[] nums = new int[n];
        
        for (int i = 0; i < n; i++) {
            nums[i] = scanner.nextInt();
        }
        
        int target = scanner.nextInt();
        
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
    }
}`,
    
    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        
        map[nums[i]] = i;
    }
    
    return {};
}

int main() {
    int n;
    cin >> n;
    
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    int target;
    cin >> target;
    
    vector<int> result = twoSum(nums, target);
    cout << result[0] << " " << result[1] << endl;
    
    return 0;
}`,
  };
  
  return templates[language] || '// Start coding here...';
};

const initialState: EditorState = {
  code: getDefaultCode('javascript'),
  fontSize: 14,
  theme: 'vs-light',
  isExecuting: false,
  output: '',
  errors: [],
  lastSaved: null,
  hasUnsavedChanges: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
      state.hasUnsavedChanges = true;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
    setErrors: (state, action: PayloadAction<string[]>) => {
      state.errors = action.payload;
    },
    saveCode: (state) => {
      state.lastSaved = new Date().toISOString();
      state.hasUnsavedChanges = false;
    },
    loadTemplate: (state, action: PayloadAction<string>) => {
      state.code = getDefaultCode(action.payload);
      state.hasUnsavedChanges = false;
    },
  },
});

export const {
  setCode,
  setFontSize,
  setTheme,
  setExecuting,
  setOutput,
  setErrors,
  saveCode,
  loadTemplate,
} = editorSlice.actions;

export default editorSlice.reducer;