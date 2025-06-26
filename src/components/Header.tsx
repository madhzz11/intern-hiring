import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setLanguage, toggleTheme } from '../store/assessmentSlice';
import { loadTemplate } from '../store/editorSlice';
import { Clock, Sun, Moon, Shield, Activity } from 'lucide-react';

const languages = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'c', label: 'C', icon: '🔧' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'reactnative', label: 'React Native', icon: '📱' },
];

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedLanguage, timeRemaining, theme } = useSelector((state: RootState) => state.assessment);
  const { tabSwitches, copyAttempts, pasteAttempts } = useSelector((state: RootState) => state.security);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (language: string) => {
    dispatch(setLanguage(language));
    dispatch(loadTemplate(language));
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'text-red-500';
    if (timeRemaining < 900) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                CodeAssess Pro
              </span>
            </div>
            
            {/* Security Status */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Activity className="h-4 w-4" />
                <span>Security Active</span>
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Switches: {tabSwitches} | Copy: {copyAttempts} | Paste: {pasteAttempts}
              </div>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Language:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2">
            <Clock className={`h-5 w-5 ${getTimeColor()}`} />
            <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;