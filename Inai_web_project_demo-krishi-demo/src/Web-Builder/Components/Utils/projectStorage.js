// // In-memory storage instead of localStorage
// let projectData = {};

// export const getProjectData = () => {
//   return projectData;
// };

// export const setProjectData = (partialData = {}) => {
//   projectData = {
//     ...projectData,
//     ...partialData,
//     updatedAt: new Date().toISOString(),
//   };
//   return projectData;
// };

// export const resetProjectData = () => {
//   projectData = {};
// };


















// ============================================================================
// 🔹 Project Storage (In-memory) — Central Storage for Builder Data
// ============================================================================

// Global project storage object
let projectData = {
  project_id: null,
  project_name: null,
  metadataPayload: null,
  builderPrefillPrompt: "",
  loadedFiles: [],
  updatedAt: null
};

/**
 * 📌 Returns the entire stored data object
 */
export const getProjectData = () => {
  return projectData;
};

/**
 * 📌 Merge partial data and update global store
 * @param {Object} partialData 
 * @returns updated object
 */
export const setProjectData = (partialData = {}) => {
  projectData = {
    ...projectData,
    ...partialData,
    updatedAt: new Date().toISOString()
  };

  // console.log("📝 Project Storage Updated:", projectData);
  return projectData;
};

/**
 * 📌 Store selected project metadata (ID + name)
 */
export const setSelectedProject = ({ id, name }) => {
  setProjectData({
    project_id: id,
    project_name: name
  });
};

/**
 * 📌 Append loaded files to storage (avoid duplicates)
 */
export const setLoadedFiles = (filesArray = []) => {
  if (!Array.isArray(filesArray)) return;

  const existing = projectData.loadedFiles || [];

  const merged = [
    ...existing,
    ...filesArray.filter(
      (file) => !existing.find((f) => f.name === file.name)
    )
  ];

  setProjectData({ loadedFiles: merged });
};

/**
 * 📌 Return files stored from backend fetch
 */
export const getLoadedFiles = () => {
  return projectData.loadedFiles || [];
};

/**
 * 📌 Reset form state while keeping project metadata
 */
export const resetFormState = () => {
  projectData = {
    ...projectData,  // Keep project ID and other metadata
    prompt: "",
    questions: [],
    answers: {},
    currentQuestionIndex: 0,
    formCompleted: false,
    updatedAt: new Date().toISOString()
  };
  console.log("🧹 Form state reset");
  return projectData;
};

/**
 * 📌 Reset and clear project storage
 */
export const resetProjectData = () => {
  projectData = {
    project_id: null,
    project_name: null,
    metadataPayload: null,
    builderPrefillPrompt: "",
    loadedFiles: [],
    prompt: "",
    questions: [],
    answers: {},
    currentQuestionIndex: 0,
    formCompleted: false,
    updatedAt: null
  };

  console.log("🧹 Project Storage Reset Done!");
  return projectData;
};

/**
 * 📌 Check if any project is active
 */
export const hasActiveProject = () => {
  return Boolean(projectData.project_id);
};
