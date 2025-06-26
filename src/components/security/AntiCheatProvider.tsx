import React, { useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { incrementTabSwitches, setTabFocus, addSecurityEvent } from '../../store/securitySlice';

interface AntiCheatProviderProps {
  children: ReactNode;
}

const AntiCheatProvider: React.FC<AntiCheatProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Track tab visibility changes
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      dispatch(setTabFocus(isVisible));
      
      if (!isVisible) {
        dispatch(incrementTabSwitches());
        dispatch(addSecurityEvent({
          type: 'TAB_SWITCH_DETECTED',
          timestamp: new Date().toISOString(),
          details: { action: 'tab_hidden' },
        }));
      }
    };

    // Track window focus/blur
    const handleWindowFocus = () => {
      dispatch(setTabFocus(true));
    };

    const handleWindowBlur = () => {
      dispatch(setTabFocus(false));
      dispatch(incrementTabSwitches());
      dispatch(addSecurityEvent({
        type: 'WINDOW_FOCUS_LOST',
        timestamp: new Date().toISOString(),
        details: { action: 'window_blur' },
      }));
    };

    // Track mouse leave (potential tab switch)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || 
          e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        dispatch(addSecurityEvent({
          type: 'MOUSE_LEFT_VIEWPORT',
          timestamp: new Date().toISOString(),
          details: { 
            x: e.clientX, 
            y: e.clientY,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
          },
        }));
      }
    };

    // Prevent print screen
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        dispatch(addSecurityEvent({
          type: 'PRINT_SCREEN_ATTEMPT',
          timestamp: new Date().toISOString(),
          details: {},
        }));
      }

      // Block Alt+Tab
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        dispatch(addSecurityEvent({
          type: 'ALT_TAB_ATTEMPT',
          timestamp: new Date().toISOString(),
          details: {},
        }));
      }

      // Block Windows key
      if (e.key === 'Meta' || e.key === 'cmd') {
        e.preventDefault();
        dispatch(addSecurityEvent({
          type: 'WINDOWS_KEY_ATTEMPT',
          timestamp: new Date().toISOString(),
          details: {},
        }));
      }
    };

    // Track clipboard events
    const handleCopy = (e: ClipboardEvent) => {
      // Allow copying from specific elements marked as selectable
      const target = e.target as Element;
      if (!target.closest('.selectable')) {
        e.preventDefault();
        dispatch(addSecurityEvent({
          type: 'COPY_BLOCKED',
          timestamp: new Date().toISOString(),
          details: { element: target.tagName },
        }));
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      // Block paste everywhere except Monaco editor
      const target = e.target as Element;
      if (!target.closest('.monaco-editor')) {
        e.preventDefault();
        dispatch(addSecurityEvent({
          type: 'PASTE_BLOCKED',
          timestamp: new Date().toISOString(),
          details: { element: target.tagName },
        }));
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [dispatch]);

  useEffect(() => {
    // Start session timer
    const startTime = Date.now();
    
    // Log session start
    dispatch(addSecurityEvent({
      type: 'SESSION_STARTED',
      timestamp: new Date().toISOString(),
      details: { 
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }));

    // Periodic activity check
    const activityTimer = setInterval(() => {
      dispatch(addSecurityEvent({
        type: 'ACTIVITY_HEARTBEAT',
        timestamp: new Date().toISOString(),
        details: { sessionDuration: Date.now() - startTime },
      }));
    }, 60000); // Every minute

    return () => {
      clearInterval(activityTimer);
      dispatch(addSecurityEvent({
        type: 'SESSION_ENDED',
        timestamp: new Date().toISOString(),
        details: { sessionDuration: Date.now() - startTime },
      }));
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AntiCheatProvider;