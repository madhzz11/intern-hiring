import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SecurityEvent {
  type: string;
  timestamp: string;
  details: any;
}

interface SecurityState {
  sessionId: string;
  keystrokeLogs: any[];
  tabSwitches: number;
  copyAttempts: number;
  pasteAttempts: number;
  securityEvents: SecurityEvent[];
  isTabFocused: boolean;
  ipAddress: string;
  userAgent: string;
  startTime: string;
}

const initialState: SecurityState = {
  sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  keystrokeLogs: [],
  tabSwitches: 0,
  copyAttempts: 0,
  pasteAttempts: 0,
  securityEvents: [],
  isTabFocused: true,
  ipAddress: '',
  userAgent: navigator.userAgent,
  startTime: new Date().toISOString(),
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    logKeystroke: (state, action: PayloadAction<any>) => {
      state.keystrokeLogs.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    incrementTabSwitches: (state) => {
      state.tabSwitches += 1;
      state.securityEvents.push({
        type: 'TAB_SWITCH',
        timestamp: new Date().toISOString(),
        details: { totalSwitches: state.tabSwitches },
      });
    },
    incrementCopyAttempts: (state) => {
      state.copyAttempts += 1;
      state.securityEvents.push({
        type: 'COPY_ATTEMPT',
        timestamp: new Date().toISOString(),
        details: { totalAttempts: state.copyAttempts },
      });
    },
    incrementPasteAttempts: (state) => {
      state.pasteAttempts += 1;
      state.securityEvents.push({
        type: 'PASTE_ATTEMPT',
        timestamp: new Date().toISOString(),
        details: { totalAttempts: state.pasteAttempts },
      });
    },
    setTabFocus: (state, action: PayloadAction<boolean>) => {
      state.isTabFocused = action.payload;
      state.securityEvents.push({
        type: action.payload ? 'TAB_FOCUS' : 'TAB_BLUR',
        timestamp: new Date().toISOString(),
        details: {},
      });
    },
    addSecurityEvent: (state, action: PayloadAction<SecurityEvent>) => {
      state.securityEvents.push(action.payload);
    },
  },
});

export const {
  logKeystroke,
  incrementTabSwitches,
  incrementCopyAttempts,
  incrementPasteAttempts,
  setTabFocus,
  addSecurityEvent,
} = securitySlice.actions;

export default securitySlice.reducer;