import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Editor } from '@monaco-editor/react';
import { RootState } from '../../store/store';
import { setCode, setFontSize, saveCode } from '../../store/editorSlice';
import { logKeystroke, incrementCopyAttempts, incrementPasteAttempts } from '../../store/securitySlice';
import EditorControls from './EditorControls';

const CodeEditor: React.FC = () => {
  const dispatch = useDispatch();
  const editorRef = useRef<any>(null);
  const { code, fontSize, theme: editorTheme, hasUnsavedChanges } = useSelector((state: RootState) => state.editor);
  const { selectedLanguage, theme } = useSelector((state: RootState) => state.assessment);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      dispatch(saveCode());
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, dispatch]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Disable copy/paste in the editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      dispatch(incrementCopyAttempts());
      // Prevent default copy behavior
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      dispatch(incrementPasteAttempts());
      // Prevent default paste behavior
    });

    // Log keystrokes for security
    editor.onKeyDown((e: any) => {
      dispatch(logKeystroke({
        key: e.code,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
      }));
    });

    // Prevent right-click context menu
    editor.onContextMenu((e: any) => {
      e.preventDefault();
    });

    // Focus the editor
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(setCode(value));
    }
  };

  const getLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      react: 'javascript',
      reactnative: 'javascript',
    };
    return languageMap[lang] || 'javascript';
  };

  const getMonacoTheme = (): string => {
    if (theme === 'dark') {
      return editorTheme === 'vs-light' ? 'vs-dark' : editorTheme;
    }
    return editorTheme === 'vs-dark' ? 'vs-light' : editorTheme;
  };

  return (
    <div className="h-full flex flex-col">
      <EditorControls />
      
      <div className="flex-1 relative">
        {hasUnsavedChanges && (
          <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs ${
            theme === 'dark' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
          }`}>
            Unsaved changes
          </div>
        )}
        
        <Editor
          height="100%"
          language={getLanguage(selectedLanguage)}
          value={code}
          theme={getMonacoTheme()}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEndOfLine: false,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            suggest: {
              enabled: true,
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            parameterHints: { enabled: true },
            contextmenu: false, // Disable right-click context menu
            selectOnLineNumbers: false,
            readOnly: false,
            domReadOnly: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;