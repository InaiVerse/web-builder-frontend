import React from 'react';
import Editor from '@monaco-editor/react';
import { formatCodeByType, ensureLineBreaks } from '../utils/codeFormatter';

const CodeEditor = ({ code, language, onChange, theme = 'vs-dark', filename }) => {
    // Format the code content to ensure proper line breaks and formatting
    const formattedCode = React.useMemo(() => {
        if (!code) return '';
        const withLineBreaks = ensureLineBreaks(code);
        return filename ? formatCodeByType(withLineBreaks, filename) : withLineBreaks;
    }, [code, filename]);

    return (
        <Editor
            height="100%"
            defaultLanguage={language || 'javascript'}
            language={language || 'javascript'}
            value={formattedCode}
            onChange={onChange}
            theme={theme}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
            }}
        />
    );
};

export default CodeEditor;
