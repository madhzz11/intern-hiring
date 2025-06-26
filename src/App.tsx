import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/Header';
import AssessmentLayout from './components/AssessmentLayout';
import AntiCheatProvider from './components/security/AntiCheatProvider';
import './security/preventCheating';

function App() {
  useEffect(() => {
    // Disable context menu globally
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable developer tools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Provider store={store}>
      <AntiCheatProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <AssessmentLayout />
        </div>
      </AntiCheatProvider>
    </Provider>
  );
}

export default App;