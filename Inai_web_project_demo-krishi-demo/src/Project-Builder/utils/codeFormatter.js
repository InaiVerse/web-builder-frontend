/**
 * Utility functions to format code content properly
 */

/**
 * Formats HTML code with proper indentation
 * @param {string} htmlString - The HTML string to format
 * @returns {string} - Formatted HTML string
 */
export const formatHTML = (htmlString) => {
    if (!htmlString || typeof htmlString !== 'string') return '';
    
    // Basic HTML formatting
    let formatted = htmlString
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/g, '');
    
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const formattedLines = [];
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        // Decrease indent for closing tags
        if (trimmed.startsWith('</')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Add current line with proper indentation
        formattedLines.push('  '.repeat(indentLevel) + trimmed);
        
        // Increase indent for opening tags (except self-closing)
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
            indentLevel++;
        }
    });
    
    return formattedLines.join('\n');
};

/**
 * Formats JavaScript code with basic formatting
 * @param {string} jsString - The JavaScript string to format
 * @returns {string} - Formatted JavaScript string
 */
export const formatJavaScript = (jsString) => {
    if (!jsString || typeof jsString !== 'string') return '';
    
    // Basic JS formatting - add line breaks after common patterns
    let formatted = jsString
        .replace(/;/g, ';\n')
        .replace(/{/g, ' {\n')
        .replace(/}/g, '\n}\n')
        .replace(/^\s+|\s+$/g, '');
    
    // Clean up multiple consecutive newlines
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return formatted;
};

/**
 * Formats CSS code with proper indentation
 * @param {string} cssString - The CSS string to format
 * @returns {string} - Formatted CSS string
 */
export const formatCSS = (cssString) => {
    if (!cssString || typeof cssString !== 'string') return '';
    
    let formatted = cssString
        .replace(/{/g, ' {\n  ')
        .replace(/}/g, '\n}\n')
        .replace(/;/g, ';\n  ')
        .replace(/^\s+|\s+$/g, '');
    
    // Clean up formatting
    formatted = formatted.replace(/\n\s*\n/g, '\n');
    formatted = formatted.replace(/  }/g, '\n}');
    
    return formatted;
};

/**
 * Auto-detect file type and format accordingly
 * @param {string} content - The code content to format
 * @param {string} filename - The filename to determine type
 * @returns {string} - Formatted code
 */
export const formatCodeByType = (content, filename) => {
    if (!content || typeof content !== 'string') return content;
    
    const extension = filename?.split('.').pop()?.toLowerCase();
    
    switch (extension) {
        case 'html':
        case 'htm':
            return formatHTML(content);
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
        case 'json':
            return formatJavaScript(content);
        case 'css':
        case 'scss':
        case 'sass':
            return formatCSS(content);
        default:
            // For unknown types, try basic formatting
            return content.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }
};

/**
 * Ensures proper line breaks in code content
 * @param {string} content - The code content
 * @returns {string} - Content with proper line breaks
 */
export const ensureLineBreaks = (content) => {
    if (!content || typeof content !== 'string') return '';
    
    return content
        .replace(/\\n/g, '\n')  // Convert escaped newlines
        .replace(/\\t/g, '\t')  // Convert escaped tabs
        .replace(/\r\n/g, '\n') // Normalize Windows line endings
        .replace(/\r/g, '\n');   // Normalize old Mac line endings
};
