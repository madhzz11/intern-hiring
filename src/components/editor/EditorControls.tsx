import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setFontSize, setTheme, saveCode } from '../../store/editorSlice';
import { Play, Save, Settings, Plus, Minus, Palette, Download } from 'lucide-react';

const EditorControls: React.FC = () => {
  const dispatch = useDispatch();
  const { fontSize, theme: editorTheme, hasUnsavedChanges, lastSaved } = useSelector((state: RootState) => state.editor);
  const { theme } = useSelector((state: RootState) => state.assessment);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta));
    dispatch(setFontSize(newSize));
  };

  const handleThemeChange = () => {
    const themes = ['vs-light', 'vs-dark', 'hc-black'];
    const currentIndex = themes.indexOf(editorTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    dispatch(setTheme(nextTheme));
  };

  const handleSave = () => {
    dispatch(saveCode());
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';
    return new Date(lastSaved).toLocaleTimeString();
  };

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center space-x-4">
        {/* Font Size Controls */}
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Font:
          </span>
          <button
            onClick={() => handleFontSizeChange(-1)}
            className={`p-1 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
            }`}
            title="Decrease font size"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className={`text-sm font-mono w-8 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {fontSize}
          </span>
          <button
            onClick={() => handleFontSizeChange(1)}
            className={`p-1 rounded hover:bg-opacity-80 ${
              theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
            }`}
            title="Increase font size"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeChange}
          className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-opacity-80 ${
            theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Change editor theme"
        >
          <Palette className="h-4 w-4" />
          <span className="text-sm capitalize">{editorTheme.replace('-', ' ')}</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Save Status */}
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Last saved: {formatLastSaved()}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
            hasUnsavedChanges
              ? theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="Save code"
        >
          <Save className="h-4 w-4" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default EditorControls;