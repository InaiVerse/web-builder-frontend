import { useState, useEffect, useCallback, useTransition, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/Web-Builder/Components/layout/header';
import { ChatPanel } from '../../../Web-Builder/Components/chat/chat-panel';
import { PreviewPanel } from '../../../Web-Builder/Components/preview/preview-panel.jsx';
import { EditorPanel } from '@/Web-Builder/Components/editor/editor-panel';
import { useToast } from '@/Web-Builder/hooks/use-toast';
import { CodeEditor } from '@/Web-Builder/Components/editor/code-editor';
import { initializeDefaultProject } from '@/Web-Builder/lib/project-initializer';
import { ProjectManager } from '@/Web-Builder/lib/project-manager';
import { AIFileSync } from '@/Web-Builder/lib/ai-file-sync';
import { initialHtml, initialCss, initialJs, initialMessages } from '@/Web-Builder/lib/initial-content';
import { extractBodyContent } from '@/Web-Builder/lib/utils';
import { mutateHtmlByPath } from '@/Web-Builder/lib/html-editor';
import { getProjectData, setProjectData } from '@/Web-Builder/Components/Utils/projectStorage';
import { Button } from '@/Web-Builder/Components/ui/button';
import { RotateCw, Undo2, Redo2 } from 'lucide-react';
import Cookies from 'js-cookie';
import JSZip from 'jszip';

const PROJECT_UPLOAD_URL = await fetch(`${import.meta.env.VITE_API_URL}/auth/project/upload-folder`);

const slugify = (value = '') => {
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'generated-project';
};

const normalizeProjectId = (value) => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? '0' : String(parsed);
};

const createProjectArchive = async (files = [], folderName = 'project') => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('No files available to archive');
  }

  const zip = new JSZip();
  files.forEach((file) => {
    if (!file?.name) return;
    const filePath = `${folderName}/${file.name}`;
    zip.file(filePath, file?.content ?? '', {
      binary: false,
    });
  });

  return zip.generateAsync({ type: 'blob' });
};

const getMimeType = (filename = '', fileType = '') => {
  const extension = (filename.split('.').pop() || '').toLowerCase();
  const map = {
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    txt: 'text/plain',
    md: 'text/markdown'
  };
  return map[extension] || (fileType === 'json' ? 'application/json' : 'text/plain');
};

/**
 * @typedef {Object} SelectedElement
 * @property {number[]} path
 * @property {string} tagName
 * @property {string} textContent
 * @property {string} classNames
 */

/**
 * @typedef {Object} ElementMutation
 * @property {('text'|'classes'|'style'|'align'|'preset')} type
 * @property {string} [value]
 * @property {string} [property]
 */

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [messages, setMessages] = useState(initialMessages);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [cssContent, setCssContent] = useState(initialCss);
  const [jsContent, setJsContent] = useState(initialJs);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedElementCode, setSelectedElementCode] = useState(null); // Store the HTML snippet of selected element
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [activeView, setActiveView] = useState('preview');
  const [prefilledPrompt, setPrefilledPrompt] = useState('');
  const [viewMode, setViewMode] = useState('desktop');
  const [folderName, setFolderName] = useState('');
  const [currentFile, setCurrentFile] = useState('index.html');
  const [metadataId, setMetadataId] = useState(null);
  const [codeHighlight, setCodeHighlight] = useState(null); // { file: 'index.html', start_line: 10, end_line: 15 }

  useEffect(() => {
    const loadProjectFiles = async () => {
      const token = Cookies.get("access_token");
      const projectId = Cookies.get("selected_project_id");
      const projectName = Cookies.get("selected_project_name");
      const projectType = Cookies.get("selected_project_type");

      if (!token || !projectId) {
        console.warn("No project selected");
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.102:8000";
        const res = await fetch(`${API_URL}/auth/project/fetch-folder`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: projectId,
            project_name: projectName,
            project_type: projectType
          }),
        });

        const data = await res.json();
        console.log("Loaded Files From Server:", data);
        console.log("smit : ", data.files);

        // Extract and store folder_name from response
        const extractedFolderName = data?.folder_name || data?.data?.folder_name || data?.project_path?.split('\\').pop() || data?.project_path?.split('/').pop() || '';
        if (extractedFolderName) {
          setFolderName(extractedFolderName);
          console.log('Stored folder_name:', extractedFolderName);
        }

        const treeData = Array.isArray(data?.tree)
          ? data.tree
          : Array.isArray(data?.data?.tree)
            ? data.data.tree
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.files)
                ? data.files
                : Array.isArray(data?.children)
                  ? data.children
                  : null;
        console.log(treeData);

        if (data.status === true && Array.isArray(treeData)) {
          // Load into Code Editor with files data
          const projectManager = ProjectManager.getInstance();
          projectManager.loadFromServer(treeData);

          // Store files data in the project manager
          if (data.files && typeof data.files === 'object') {
            projectManager.files = data.files;
            console.log('Files data stored in ProjectManager:', Object.keys(data.files));
          }

          // Auto open index.html if exists
          const indexFile = projectManager.findFileByName("index.html");
          if (indexFile) {
            ProjectManager.getInstance().setActiveFile(indexFile.id);
          }

          toast({
            title: "Project Loaded",
            description: "Files loaded into editor successfully 🚀",
          });
        }
      } catch (err) {
        console.error("Project Load Error:", err);
      }
    };

    loadProjectFiles();
  }, []);

  // Track active file changes from ProjectManager
  useEffect(() => {
    const projectManager = ProjectManager.getInstance();

    // Set up interval to check for active file changes
    const checkActiveFile = () => {
      const activeFileId = projectManager.project.activeFileId;
      if (activeFileId) {
        const activeFile = projectManager.findNode(activeFileId);
        if (activeFile && activeFile.name !== currentFile) {
          setCurrentFile(activeFile.name);
          console.log('🔄 Current file changed to:', activeFile.name);
          console.log('📄 Active file ID:', activeFileId);

          // NEW: Sync preview content when active file changes
          if (activeFile.name.endsWith('.html')) {
            setHtmlContent(activeFile.content || '');
            console.log('📄 Updated htmlContent for preview');
          }
        }
      }
    };

    // Check immediately
    checkActiveFile();

    // Check periodically for changes
    const intervalId = setInterval(checkActiveFile, 500);

    return () => clearInterval(intervalId);
  }, [currentFile]);

  // Initialize AI file sync
  const fileSync = useMemo(() => new AIFileSync(), []);

  const uploadGeneratedProject = useCallback(async (promptForName) => {

    const token = Cookies.get('access_token');
    if (!token) return navigate('/signin');

    const files = ProjectManager.getInstance().exportProjectStructure();
    if (!files?.length) {
      throw new Error('No generated files available to upload');
    }

    const storedData = getProjectData();
    const projectNameSource = storedData?.metadataPayload?.project_name
      || storedData?.project_name
      || storedData?.metadataPayload?.prompt
      || promptForName
      || 'generated project';
    const projectName = slugify(projectNameSource).slice(0, 30) || 'generated_project';
    // const projectIdRaw = storedData?.project_id
    //   || storedData?.metadataPayload?.project_id
    //   || storedData?.metadataPayload?.metadata_id
    //   || storedData?.lastUploadProjectId
    //   || '0';

    // const projectId = normalizeProjectId(projectIdRaw);

    const cookieProjectId = Cookies.get('project_id');
    const projectId = normalizeProjectId(cookieProjectId);

    // console.log("Project ID from cookies:", projectId);
    // const projectId = normalizeProjectId(projectIdRaw);

    console.log('[Upload] Preparing project archive', {
      projectName,
      projectId,
      fileCount: files.length,
      sampleFiles: files.slice(0, 5).map((file) => ({
        name: file?.name,
        chars: file?.content?.length || 0,
        type: file?.type
      }))
    });

    const folderName = `${projectName}-generated`;
    const archiveBlob = await createProjectArchive(files, folderName);
    console.log('[Upload] Archive created', {
      folderName,
      archiveSize: archiveBlob.size
    });

    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('project_id', projectId);

    // Pass each file without zip
    files.forEach((file) => {
      if (!file?.name || !file?.content) return;

      const blob = new Blob([file.content], {
        type: getMimeType(file.name, file.type),
      });

      formData.append(
        "files",
        blob,
        file.name.includes('/') ? file.name : `${folderName}/${file.name}`
      );
    });


    const authHeader = token.toLowerCase().startsWith('bearer ')
      ? token
      : `Bearer ${token}`;

    const response = await fetch(PROJECT_UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Upload failed with status ${response.status}`);
    }

    try {
      const payload = await response.json();
      console.log('[Upload] API success response', payload);
      return payload;
    } catch (parseErr) {
      console.warn('Upload response parse error:', parseErr);
      return { status: response.status };
    }
  }, []);

  // Load project data on mount and handle navigation
  useEffect(() => {
    // Check if coming from Pages (no refresh scenario)
    if (location.state?.fromPages) {
      console.log('Navigated from Pages without refresh');
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }

    // Restore scroll position if exists
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, [location]);

  // Prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your work may be lost.';
      return 'Are you sure you want to leave? Your work may be lost.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const [history, setHistory] = useState([initialHtml]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushHistory = useCallback((nextHtml) => {
    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, nextHtml];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    setHistoryIndex((prev) => prev - 1);
    setHtmlContent(history[historyIndex - 1]);
  }, [canUndo, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    setHistoryIndex((prev) => prev + 1);
    setHtmlContent(history[historyIndex + 1]);
  }, [canRedo, history, historyIndex]);

  const handleRefreshPreview = useCallback(() => {
    setHtmlContent((prev) => `${prev}`);
  }, []);

  const handleChatSubmit = (prompt, isRecommendationFlow = false, interactionType = 'text_to_text') => {
    console.log('handleChatSubmit called with:', prompt, 'isRecommendationFlow:', isRecommendationFlow, 'interactionType:', interactionType);

    // For recommendation flow, trust the isRecommendationFlow parameter
    // Don't override it based on prefilledPrompt state
    const finalIsRecommendationFlow = isRecommendationFlow;
    console.log('Final isRecommendationFlow:', finalIsRecommendationFlow);

    // Combine prefilled prompt with user prompt if available
    const finalPrompt = prefilledPrompt ? `${prefilledPrompt}\n\nUser Request: ${prompt}` : prompt;

    const userMessage = {
      role: 'user',
      content: finalPrompt,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setSelectedElement(null);

    startTransition(async () => {
      try {
        // Get current project files for context
        const projectManager = ProjectManager.getInstance();
        const currentFiles = projectManager.exportProjectStructure();

        // Choose API endpoint based on flow type
        const apiEndpoint = finalIsRecommendationFlow ? '/chat' : '/assistant/chat';
        console.log('Using API endpoint:', apiEndpoint);

        // Call streaming API route
        const projectId = Cookies.get("selected_project_id");
        const requestBody = {
          prompt: finalPrompt,
          interaction_type: interactionType
        };

        // Add folder_name and project_id for both endpoints
        console.log('=== REQUEST DEBUG INFO ===');
        console.log('📄 Current File State:', currentFile);
        console.log('📁 Folder Name:', folderName);
        console.log('🆔 Project ID:', projectId);
        console.log('📋 Metadata ID:', metadataId);
        console.log('💬 Messages Count:', messages.length);
        console.log('========================');

        if (folderName) {
          requestBody.folder_name = folderName;
          console.log(`✅ Sending folder_name to ${apiEndpoint} API:`, folderName);
        }
        if (projectId) {
          requestBody.project_id = projectId;
          console.log(`✅ Sending project_id to ${apiEndpoint} API:`, projectId);
        }
        if (currentFile) {
          requestBody.current_file = currentFile;
          console.log(`✅ Sending current_file to ${apiEndpoint} API:`, currentFile);
        } else {
          console.warn('⚠️ No current_file set! Will modify all files.');
        }
        if (metadataId) {
          requestBody.metadata_id = metadataId;
          console.log(`✅ Sending metadata_id to ${apiEndpoint} API:`, metadataId);
        }

        // 🔥 NEW: Add conversation history for context-aware responses
        // Convert frontend messages to backend format (exclude current message, it's in prompt)
        const conversationHistory = messages
          .filter(msg => msg.role && msg.content) // Only valid messages
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }));

        if (conversationHistory.length > 0) {
          requestBody.conversation_history = conversationHistory;
          console.log(`💬 Sending conversation_history (${conversationHistory.length} messages)`);
          console.log('📝 Last 3 messages:', conversationHistory.slice(-3).map(m => `${m.role}: ${m.content.substring(0, 50)}...`));
        }

        // 🔥 NEW: Add selected element info for targeted modifications (matching backend SelectedElementInfo schema)
        if (selectedElement) {
          requestBody.selected_element = {
            selector: selectedElement.selector || '',
            tag_name: selectedElement.tag_name || selectedElement.tagName?.toLowerCase() || '',
            html_snippet: selectedElement.html_snippet || selectedElement.outerHTML || selectedElementCode?.outerHTML || '',
            inner_text: selectedElement.inner_text || selectedElement.textContent || selectedElementCode?.textContent || '',
            current_styles: selectedElement.current_styles || {},
            attributes: selectedElement.attributes || {},
            parent_selector: selectedElement.parent_selector || '',
            position_in_file: selectedElement.position_in_file || null,
            file_name: currentFile || 'index.html'
          };
          console.log('🎯 Selected element being sent:', requestBody.selected_element);
          console.log('🎯 Selector:', requestBody.selected_element.selector);
          console.log('🎯 Tag:', requestBody.selected_element.tag_name);
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}${apiEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        // Check if response is streaming or regular JSON
        const contentType = response.headers.get('content-type');

        // For recommendation flow (/chat), always treat as streaming
        // For regular flow (/assistant/chat), check content-type
        if ((isRecommendationFlow || (contentType && contentType.includes('text/plain'))) && response.body) {
          // Handle streaming response (original logic)
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          // Add initial streaming message
          let streamingMessage = {
            role: 'assistant',
            content: '',
          };
          setMessages(prev => [...prev, streamingMessage]);

          let aiResponse = null;
          let isMultiFile = false;
          const streamedFiles = []
          let streamingCodeContent = '';
          let streamError = null;

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));

                  switch (data.type) {
                    case 'status':
                      // Update streaming message with status
                      streamingMessage = {
                        ...streamingMessage,
                        content: data.message,
                      };
                      setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = streamingMessage;
                        return updated;
                      });
                      break;

                    case 'code_chunk':
                      // Accumulate streaming code chunks
                      streamingCodeContent += data.chunk;

                      // Update streaming message to show live code generation
                      streamingMessage = {
                        ...streamingMessage,
                        content: `Generating code...\n\`\`\`\`\n${streamingCodeContent}\n\`\`\``,
                        code: streamingCodeContent,
                      };
                      setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = streamingMessage;
                        return updated;
                      });
                      break;

                    case 'file':
                      // Add file to streamed files and update editor
                      streamedFiles.push(data.file);

                      // Update code editor immediately with new file
                      fileSync.syncSingleFile(data.file.name, data.file.content, data.file.type);

                      // Update streaming message to show file creation
                      streamingMessage = {
                        ...streamingMessage,
                        content: `${streamingMessage.content}\n📁 Created ${data.file.name}`,
                      };
                      setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = streamingMessage;
                        return updated;
                      });
                      break;

                    case 'complete':
                      aiResponse = data.response;
                      isMultiFile = data.isMultiFile;

                      // Final success message
                      const finalMessage = isMultiFile
                        ? `✅ Multi-file project structure has been created and synchronized with the code editor. Check the Code tab to see all files and folders.`
                        : `✅ Code has been generated and updated in the editor.`;

                      setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                          role: 'assistant',
                          content: finalMessage,
                        };
                        return updated;
                      });
                      break;

                    case 'error': {
                      streamError = data.error || 'Unknown error occurred';

                      streamingMessage = {
                        role: 'assistant',
                        content: `⚠️ ${streamError}`,
                      };
                      setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = streamingMessage;
                        return updated;
                      });

                      toast({
                        title: 'Generation error',
                        description: streamError,
                        variant: 'destructive',
                      });

                      await reader.cancel();
                      break;
                    }
                  }
                } catch (parseError) {
                  console.error('Error parsing stream data:', parseError);
                }
              }
            }

            if (streamError) {
              break;
            }
          }

          if (streamError) {
            return;
          }

          // Update legacy state for compatibility
          let legacyResponse = {};

          if (!isMultiFile && aiResponse) {
            // Check if response has pages format (legacy single-file)
            if (typeof aiResponse === 'object' && aiResponse !== null && 'pages' in aiResponse) {
              const legacyTypedResponse = aiResponse;

              // Get HTML from pages - preserve complete HTML if present
              const firstPage = legacyTypedResponse.pages?.[0];
              let htmlFromPages = '';
              if (firstPage) {
                const pageBody = typeof firstPage.body === 'string' ? firstPage.body : '';
                // Check if it's complete HTML or body-only
                if (pageBody.trim().startsWith('<!DOCTYPE') || pageBody.trim().startsWith('<html')) {
                  htmlFromPages = pageBody; // Complete HTML
                } else {
                  htmlFromPages = extractBodyContent(pageBody); // Body-only (backward compat)
                }
              }

              // Get HTML from legacy html field
              const legacyHtmlField = legacyTypedResponse.html;
              let legacyHtml = '';
              if (typeof legacyHtmlField === 'string') {
                if (legacyHtmlField.trim().startsWith('<!DOCTYPE') || legacyHtmlField.trim().startsWith('<html')) {
                  legacyHtml = legacyHtmlField; // Complete HTML
                } else {
                  legacyHtml = extractBodyContent(legacyHtmlField); // Body-only (backward compat)
                }
              }

              const normalizedHtml = htmlFromPages || legacyHtml;

              if (normalizedHtml) {
                setHtmlContent(normalizedHtml);
                pushHistory(normalizedHtml);
                if (legacyTypedResponse.css) {
                  setCssContent(legacyTypedResponse.css);
                }
                if (legacyTypedResponse.js) {
                  setJsContent(legacyTypedResponse.js);
                }
                setActiveView('preview');
              }

              // Store the typed response for use in message generation
              legacyResponse = legacyTypedResponse;
            }
          } else {
            // Update legacy state from file sync for multi-file responses
            const legacyContents = fileSync.getLegacyContents();
            if (legacyContents.html) {
              setHtmlContent(legacyContents.html);
              pushHistory(legacyContents.html);
            }
            setCssContent(legacyContents.css);
            setJsContent(legacyContents.js);
          }
        } else {
          // Handle regular JSON response (for /assistant/chat)
          const data = await response.json();
          console.log('Assistant response:', data);

          // NEW: Sync updated files to code panel in real-time
          if (data.updated_file_contents && typeof data.updated_file_contents === 'object') {
            try {
              console.log('Syncing updated files to code panel:', Object.keys(data.updated_file_contents));

              // Sync updated files to ProjectManager (code panel)
              const projectManager = ProjectManager.getInstance();

              Object.entries(data.updated_file_contents).forEach(([filename, fileContent]) => {
                console.log(`Syncing ${filename} to code panel (${fileContent.length} chars)`);

                // Find file in project manager
                const file = projectManager.findFileByName(filename);

                if (file) {
                  // Update existing file content
                  projectManager.updateFile(file.id, fileContent);
                  console.log(`✅ Updated ${filename} in code panel`);

                  // If this is the active file, refresh the view
                  if (projectManager.project.activeFileId === file.id) {
                    projectManager.setActiveFile(file.id);
                    console.log(`🔄 Refreshed active file view for ${filename}`);
                  }
                } else {
                  console.warn(`⚠️ File ${filename} not found in code panel`);
                }
              });

              toast({
                title: 'Code Updated',
                description: `${Object.keys(data.updated_file_contents).length} file(s) updated in code panel`,
              });
            } catch (syncError) {
              console.error('Error syncing files to code panel:', syncError);
              toast({
                title: 'Sync Error',
                description: 'Failed to update code panel',
                variant: 'destructive',
              });
            }
          }

          // 🔥 NEW: Force preview refresh after code updates
          if (data.updated_file_contents && typeof data.updated_file_contents === 'object') {
            try {
              console.log('🔄 Forcing preview refresh...');

              // Update legacy state if current file was modified
              if (data.updated_file_contents[currentFile]) {
                const updatedContent = data.updated_file_contents[currentFile];
                console.log(`Updating preview with new ${currentFile} content`);

                // Update HTML content state to trigger preview re-render
                setHtmlContent(updatedContent);
                pushHistory(updatedContent);

                // Switch to preview view to show changes
                setActiveView('preview');

                console.log('✅ Preview refreshed with updated content');
              } else {
                // If a different file was updated, just force a refresh
                console.log('Different file updated, triggering preview refresh');
                setHtmlContent((prev) => prev + ' '); // Trigger re-render
                setTimeout(() => setHtmlContent((prev) => prev.trim()), 10);
              }

              toast({
                title: 'Changes Applied',
                description: 'Preview updated with your changes',
              });
            } catch (refreshError) {
              console.error('Error refreshing preview:', refreshError);
            }
          }

          // Display the assistant's response with execution steps
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.response || data.message || 'No response received',
              execution_steps: data.execution_steps || null,
              mode: data.mode || null
            }
          ]);

          // Log execution steps if present
          if (data.execution_steps && data.execution_steps.length > 0) {
            console.log('📋 Execution steps received:', data.execution_steps);
          }

          // 🔥 NEW: Handle code_highlight from backend for code editor scrolling/highlighting
          if (data.code_highlight) {
            console.log('📍 Code highlight received:', data.code_highlight);
            setCodeHighlight(data.code_highlight);

            // Switch to code view to show the highlighted changes
            if (data.code_highlight.file) {
              // Find and activate the file in ProjectManager
              const projectManager = ProjectManager.getInstance();
              const file = projectManager.findFileByName(data.code_highlight.file);
              if (file) {
                projectManager.setActiveFile(file.id);
                setCurrentFile(data.code_highlight.file);
                setActiveView('code');
                console.log('✅ Switched to code view for:', data.code_highlight.file);
              }
            }
          }

          // Handle selected_element_context from backend (optional logging)
          if (data.selected_element_context) {
            console.log('🎯 Backend modified element:', data.selected_element_context);
          }

          // Handle audio playback if audio_data is present
          if (data.audio_data && data.audio_format) {
            try {
              console.log('Audio data received, preparing to play...');

              // Decode base64 audio data
              const binaryString = atob(data.audio_data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }

              // Create blob from audio data
              const audioBlob = new Blob([bytes], { type: `audio/${data.audio_format}` });
              const audioUrl = URL.createObjectURL(audioBlob);

              // Create and play audio element
              const audio = new Audio(audioUrl);
              audio.play()
                .then(() => {
                  console.log('Audio playback started successfully');
                })
                .catch((error) => {
                  console.error('Audio playback failed:', error);
                  toast({
                    title: 'Audio playback failed',
                    description: 'Could not play the audio response',
                    variant: 'destructive',
                  });
                });

              // Clean up the URL after playback
              audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                console.log('Audio playback completed');
              };
            } catch (error) {
              console.error('Error processing audio:', error);
              toast({
                title: 'Audio processing error',
                description: 'Failed to process audio data',
                variant: 'destructive',
              });
            }
          }
        }

        // Auto-upload generated code after successful response
        try {
          const uploadResult = await uploadGeneratedProject(finalPrompt);
          toast({
            title: 'Upload complete',
            description: uploadResult?.message || 'Project files uploaded successfully.'
          });
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Upload failed',
            description: uploadError?.message || 'Unable to upload generated files.',
            variant: 'destructive'
          });
        }

      } catch (error) {
        console.error('Chat submission error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to process your request. Please try again.',
          variant: 'destructive',
        });
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ]);
      }
    });
  };

  // Auto-send prefilled prompt if available from question-answering system
  useEffect(() => {
    const stored = getProjectData();

    // ⭐ Extract and store metadata_id (prioritize new metadataId field)
    const extractedMetadataId = stored?.metadataId || stored?.metadataPayload?.metadata_id || null;
    if (extractedMetadataId) {
      setMetadataId(extractedMetadataId);
      console.log('📋 Extracted and stored metadata_id:', extractedMetadataId);
      console.log('📦 Source:', stored?.metadataId ? 'metadataId field' : 'metadataPayload.metadata_id');
    } else {
      console.warn('⚠️ No metadata_id found in localStorage!');
    }

    if (stored?.builderPrefillPrompt) {
      console.log('Found builderPrefillPrompt, setting up recommendation flow');
      setPrefilledPrompt(stored.builderPrefillPrompt);
      setProjectData({ builderPrefillPrompt: '', metadataPayload: stored.metadataPayload });

      // Auto-send the prefilled prompt to chat endpoint with recommendation flow flag
      setTimeout(() => {
        console.log('Auto-submitting recommendation prompt to /chat API');
        console.log('🎯 Using metadata_id:', extractedMetadataId);
        handleChatSubmit(stored.builderPrefillPrompt, true, 'text_to_text'); // Pass true for recommendation flow
        // Clear prefilledPrompt after submission to prevent affecting future inputs
        setPrefilledPrompt('');
        console.log('Cleared prefilledPrompt, future inputs will use /assistant/chat');
      }, 1000); // Small delay to ensure UI is ready
    }
  }, [handleChatSubmit]);

  const handleElementUpdate = useCallback((path, mutation) => {
    if (!path || !mutation) return;

    const applyStyle = (node, property, value) => {
      if (!value) return;
      if (property === 'opacity') {
        const numeric = Number(value);
        if (!Number.isNaN(numeric)) {
          node.style.opacity = Math.max(0, Math.min(1, numeric / 100)).toString();
        }
        return;
      }

      // Type-safe style property assignment
      if (property in node.style) {
        // Use direct property access for standard CSS properties
        node.style[property] = value;
      } else {
        // Handle custom CSS properties
        node.style.setProperty(property, value);
      }
    };

    const applyPreset = (node, preset) => {
      switch (preset) {
        case 'gradient':
          node.style.backgroundImage = 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)';
          node.style.color = '#fff';
          node.style.border = 'none';
          node.style.borderRadius = node.style.borderRadius || '9999px';
          break;
        case 'shadow':
          node.style.boxShadow = '0 20px 45px rgba(15, 23, 42, 0.35)';
          break;
        case 'border':
          node.style.border = '1px solid rgba(148, 163, 184, 0.5)';
          node.style.borderRadius = node.style.borderRadius || '16px';
          break;
        case 'glass':
          node.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
          node.style.border = '1px solid rgba(255, 255, 255, 0.2)';
          node.style.backdropFilter = 'blur(16px)';
          node.style.borderRadius = '24px';
          break;
        case 'pill':
          node.style.borderRadius = '9999px';
          node.style.padding = node.style.padding || '0.75rem 1.5rem';
          break;
        case 'hover':
          node.style.transition = 'transform 200ms ease, box-shadow 200ms ease';
          node.style.transformOrigin = 'center';
          node.onmouseenter = () => {
            node.style.transform = 'scale(1.02)';
            node.style.boxShadow = '0 20px 45px rgba(15, 23, 42, 0.3)';
          };
          node.onmouseleave = () => {
            node.style.transform = 'scale(1)';
            node.style.boxShadow = 'none';
          };
          break;
        default:
          break;
      }
    };

    setHtmlContent((prev) => {
      // Check if we're working with complete HTML or body-only
      const isCompleteHtml = prev.trim().startsWith('<!DOCTYPE') || prev.trim().startsWith('<html');

      let bodyContent = prev;
      let htmlPrefix = '';
      let htmlSuffix = '';

      if (isCompleteHtml) {
        // Extract body content for mutation
        const bodyStartMatch = prev.match(/<body[^>]*>/i);
        const bodyEndMatch = prev.match(/<\/body>/i);

        if (bodyStartMatch && bodyEndMatch && typeof bodyStartMatch.index === 'number' && typeof bodyEndMatch.index === 'number') {
          const bodyStartIndex = bodyStartMatch.index + bodyStartMatch[0].length;
          const bodyEndIndex = bodyEndMatch.index;

          htmlPrefix = prev.substring(0, bodyStartIndex);
          bodyContent = prev.substring(bodyStartIndex, bodyEndIndex);
          htmlSuffix = prev.substring(bodyEndIndex);
        }
      }

      // Mutate the body content
      const next = mutateHtmlByPath(bodyContent, path, (node) => {
        switch (mutation.type) {
          case 'text':
            node.textContent = mutation.value;
            break;
          case 'classes':
            node.className = mutation.value;
            break;
          case 'style':
            applyStyle(node, mutation.property, mutation.value);
            break;
          case 'align':
            node.style.textAlign = mutation.value;
            break;
          case 'preset':
            applyPreset(node, mutation.value);
            break;
          default:
            break;
        }
      });

      pushHistory(next);

      // Reconstruct complete HTML if needed
      const finalHtml = isCompleteHtml ? htmlPrefix + next + htmlSuffix : next;

      // Sync the updated HTML with the code editor
      const projectManager = ProjectManager.getInstance();
      fileSync.syncSingleFile('index.html', finalHtml, 'html');

      return isCompleteHtml ? finalHtml : next;
    });
  }, [pushHistory, fileSync]);

  const handleMessage = useCallback((event) => {
    // Relaxed security check for debugging and iframe consistency
    // if (event.source !== iframeRef.current?.contentWindow) return;

    const { type, ...data } = event.data;

    // Log all nextinai events for debugging
    if (type?.startsWith('nextinai-')) {
      console.log('📨 Received event:', type, data);
    }

    if (type === 'nextinai-select') {
      console.log('🎯 Received enhanced element selection:', data);

      // Store the complete enhanced element data
      setSelectedElement(data);

      setSelectedElementCode({
        outerHTML: data.html_snippet || '',
        tagName: data.tag_name || data.tagName || '',
        textContent: data.inner_text || data.textContent || '',
        className: data.classNames || '',
        id: data.attributes?.id || ''
      });
    } else if (type === 'nextinai-navigate') {
      const targetPath = data.path;
      console.log('🧭 Navigation requested to:', targetPath);

      let normalizedPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;

      if (normalizedPath === '/') {
        normalizedPath = '/index.html';
      }

      const projectManager = ProjectManager.getInstance();
      let file = projectManager.getFileByPath(normalizedPath);

      if (!file && !normalizedPath.endsWith('.html')) {
        file = projectManager.getFileByPath(`${normalizedPath}.html`);
      }

      if (!file) {
        file = projectManager.getFileByPath(`${normalizedPath}/index.html`.replace('//', '/'));
      }

      // Fallback: search by name only (for flat structures)
      if (!file) {
        const fileName = targetPath.split('/').pop();
        file = projectManager.findFileByName(fileName);
      }

      // Ultimate Fallback: Direct search in root (since we saw it in logs)
      if (!file && projectManager?.project?.root?.children) {
        const fileName = targetPath.split('/').pop();
        file = projectManager.project.root.children.find(c => c.name === fileName);
      }

      if (file) {
        if (!file.content && file.content !== '') {
          console.warn(`⚠️ File ${file.name} found but has NO content!`);
        }

        // Wrap in timeout to start a fresh event cycle
        setTimeout(() => {
          console.log('✅ Executing navigation to:', file.name);

          // 1. Update Project Manager (Source of truth)
          projectManager.setActiveFile(file.id);

          // 2. Update UI State force-sync
          setCurrentFile(file.name);
          // Ensure content is string
          const safeContent = file.content || '';
          setHtmlContent(safeContent);
          pushHistory(safeContent);
        }, 10);
      } else {
        console.warn('❌ File not found for navigation:', targetPath);

        toast({
          title: 'Page not found',
          description: `Could not find page: ${targetPath}`,
          variant: 'destructive',
        });
      }
    }
  }, [pushHistory, toast]);

  const iframeRef = useRef(null);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  // Initialize default project on mount
  useEffect(() => {
    initializeDefaultProject();
  }, []);

  // Sync with ProjectManager
  useEffect(() => {
    const projectManager = ProjectManager.getInstance();
    const unsubscribe = projectManager.subscribe((project) => {
      if (project.activeFileId) {
        const file = projectManager.findNodePublic(project.activeFileId);
        if (file && file.type === 'file') {
          if (file.language === 'html') {
            setHtmlContent(file.content || '');
          } else if (file.language === 'css') {
            setCssContent(file.content || '');
          } else if (file.language === 'javascript' || file.language === 'js') {
            setJsContent(file.content || '');
          }
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0b0b0f] text-slate-100">
      <Header
        htmlContent={htmlContent}
        cssContent={cssContent}
        jsContent={jsContent}
        activeView={activeView}
        onSelectView={setActiveView}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRefresh={handleRefreshPreview}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <main className="grid flex-1 min-h-0 pt-[5.25rem] grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_360px] bg-gradient-to-br from-[#0b0b0f] via-[#121321] to-[#09090f]">
        <div className="relative col-span-1 flex flex-col min-h-0 bg-[#0b0c11]/85 md:col-span-1 xl:col-span-2">
          {/* EditorPanel - Slides in from left */}
          {selectedElement && (
            <EditorPanel
              element={selectedElement}
              onClose={() => setSelectedElement(null)}
              onUpdate={handleElementUpdate}
            />
          )}

          {/* Preview/Code area with dynamic margin when EditorPanel is open */}
          <div
            className={`
              flex flex-1 flex-col min-h-0 w-full transition-all duration-300 ease-in-out
              ${selectedElement ? 'ml-[340px]' : 'ml-0'}
            `}
            style={{
              width: selectedElement ? 'calc(100% - 340px)' : '100%'
            }}
          >
            {/* <div className="flex items-center justify-between border-b border-white/5 bg-white/5/30 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                {activeView === 'preview' ? 'Preview Mode' : 'Code Mode'}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo"
                  className="rounded-full border border-white/10 bg-white/10 hover:border-slate-300"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="Redo"
                  className="rounded-full border border-white/10 bg-white/10 hover:border-slate-300"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefreshPreview}
                  title="Refresh preview"
                  className="rounded-full border border-white/10 bg-white/10 hover:border-slate-300"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div> */}

            {activeView === 'preview' ? (
              <div className="flex-1 min-h-0 overflow-auto bg-[#0f1624]">
                <PreviewPanel
                  key={currentFile} // Force re-mount on file change to prevent white screen
                  ref={iframeRef}
                  htmlContent={htmlContent}
                  cssContent={cssContent}
                  jsContent={jsContent}
                  isSelectMode={isSelectMode}
                  onToggleSelectMode={() => setIsSelectMode(prev => !prev)}
                  viewMode={viewMode}
                />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-hidden bg-[#050509]">
                <CodeEditor
                  className="h-full bg-transparent"
                  highlightRange={codeHighlight}
                  onHighlightClear={() => setCodeHighlight(null)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 flex flex-col min-h-0 border-t border-white/5 bg-[#0f1624]/90 md:col-span-1 md:col-start-2 md:border-t-0 md:border-l xl:col-start-3">
          <ChatPanel
            messages={messages}
            isLoading={isPending}
            onSubmit={handleChatSubmit}
            initialPrompt={prefilledPrompt}
            selectedElement={selectedElement}
            selectedElementCode={selectedElementCode}
            onClearSelection={() => {
              setSelectedElement(null);
              setSelectedElementCode(null);
            }}
          />
        </div>
      </main>
    </div>
  );
}