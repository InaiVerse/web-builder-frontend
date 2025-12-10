import { FaMoon } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import LeftSidebar from "./leftSidebar";
import "../../../App.css";

const API_CONFIG = {
  loadUrl: "http://192.168.1.87:5555/auth/project/main-json",
  uploadUrl: "http://192.168.1.87:5555/auth/project/upload-json",
  authToken:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc5NTAxNTk3OCwianRpIjoiZDE1MjNhYWYtOGFkYS00NzE2LTlmMjgtNzc3NzM1NjU5OGVlIn0.tDUkrDX35AwsABrx_ijyCUNuXxNKlkPIR_CtA03VW_g",
  projectName: "inai_model",
};

const classNames = {
  navLink:
    "nav-link flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 w-full",
  activeNavLink: "bg-white/10 text-white",
  btn:
    "btn inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-4 py-2 text-sm font-medium",
  btnSecondary: "btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15",
  btnPrimary: "btn-primary bg-blue-600 text-white hover:bg-blue-700",
  btnDanger: "btn-danger bg-red-500 text-white hover:bg-red-600",
  input:
    "field-input w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/60 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40",
};

const formatLabel = (label) =>
  (label || "Value")
    .replace(/([A-Z])/g, " $1")
    .replace(/[_\-]/g, " ")
    .replace(/\[(\d+)\]/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());

const toSegments = (path) => (path ? path.split(".") : []);

const resolveKey = (segment) => {
  const index = Number(segment);
  return Number.isNaN(index) ? segment : index;
};

const getValue = (data, path) =>
  toSegments(path).reduce((acc, segment) => {
    if (acc === undefined || acc === null) {
      return undefined;
    }
    const key = resolveKey(segment);
    return acc[key];
  }, data);

const setValue = (data, path, value) => {
  const segments = toSegments(path);
  if (!segments.length) return value;

  const clone = Array.isArray(data) ? [...data] : { ...data };
  let cursor = clone;

  segments.forEach((segment, index) => {
    const key = resolveKey(segment);
    const isLast = index === segments.length - 1;

    if (isLast) {
      cursor[key] = value;
      return;
    }

    const nextKey = resolveKey(segments[index + 1]);
    const nextIsIndex = typeof nextKey === "number";

    if (cursor[key] === undefined) {
      cursor[key] = nextIsIndex ? [] : {};
    } else if (nextIsIndex && !Array.isArray(cursor[key])) {
      cursor[key] = [];
    } else if (!nextIsIndex && (cursor[key] === null || typeof cursor[key] !== "object")) {
      cursor[key] = {};
    } else if (Array.isArray(cursor[key])) {
      cursor[key] = [...cursor[key]];
    } else {
      cursor[key] = { ...cursor[key] };
    }

    cursor = cursor[key];
  });

  return clone;
};

const removeFromArray = (data, path, index) => {
  const array = getValue(data, path);
  if (!Array.isArray(array)) return data;
  const next = [...array.slice(0, index), ...array.slice(index + 1)];
  return setValue(data, path, next);
};

const Admin = () => {
  const [jsonData, setJsonData] = useState({});
  const [currentSection, setCurrentSection] = useState(null);
  const [activeView, setActiveView] = useState("form");
  const [message, setMessage] = useState({ text: "", type: "info" });
  const [jsonEditorValue, setJsonEditorValue] = useState("{}");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const userName = "Admin";

  const showMessage = useCallback((text, type = "info") => {
    setMessage({ text, type });
  }, []);

  const loadJson = useCallback(async () => {
    try {
      showMessage("Loading JSON...", "info");

      const response = await fetch(API_CONFIG.loadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: API_CONFIG.authToken,
        },
        body: JSON.stringify({ project_name: API_CONFIG.projectName }),
      });

      if (!response.ok) throw new Error(`Failed to load JSON (HTTP ${response.status})`);

      const payload = await response.json();
      if (!payload?.data) throw new Error(payload?.message || "JSON data missing in response");

      setJsonData(payload.data);
      setCurrentSection(null);
      setJsonEditorValue(JSON.stringify(payload.data, null, 2));
      showMessage(payload?.message || "JSON loaded successfully", "success");
    } catch (error) {
      showMessage(error.message || "Failed to load JSON", "error");
    }
  }, [showMessage]);

  const submitJson = useCallback(
    async (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const formData = new FormData();
      formData.append("project_name", API_CONFIG.projectName);
      formData.append("json_file", blob, "main.json");

      const response = await fetch(API_CONFIG.uploadUrl, {
        method: "POST",
        headers: {
          Authorization: API_CONFIG.authToken,
        },
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to save JSON (HTTP ${response.status})`);

      const result = await response.json();
      if (result?.status === false) throw new Error(result?.message || "Failed to save JSON");

      showMessage(result?.message || "JSON saved successfully", "success");
    },
    [showMessage]
  );

  const saveJson = useCallback(async () => {
    try {
      const dataToSave = activeView === "raw" ? JSON.parse(jsonEditorValue) : jsonData;
      await submitJson(dataToSave);
      setJsonData(dataToSave);
      setJsonEditorValue(JSON.stringify(dataToSave, null, 2));
    } catch (error) {
      showMessage(error.message || "Failed to save JSON", "error");
    }
  }, [activeView, jsonData, jsonEditorValue, submitJson, showMessage]);

  const handleFieldChange = useCallback((path, nextValue) => {
    setJsonData((prev) => {
      const updated = setValue(prev, path, nextValue);
      setJsonEditorValue(JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  const handleArrayAdd = useCallback((path) => {
    setJsonData((prev) => {
      const currentArray = getValue(prev, path) || [];
      const firstItem = currentArray.find((item) => item !== undefined && item !== null);
      const template = typeof firstItem === "object" && !Array.isArray(firstItem) ? { ...firstItem } : "";
      const updated = setValue(prev, path, [...currentArray, template]);
      setJsonEditorValue(JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  const handleArrayRemove = useCallback((path, index) => {
    setJsonData((prev) => {
      const updated = removeFromArray(prev, path, index);
      setJsonEditorValue(JSON.stringify(updated, null, 2));
      return updated;
    });
  }, []);

  const sections = useMemo(() => Object.keys(jsonData || {}), [jsonData]);

  useEffect(() => {
    loadJson();
  }, [loadJson]);

  useEffect(() => {
    if (sections.length && !currentSection) {
      setCurrentSection(sections[0]);
    }
  }, [sections, currentSection]);

  const renderValueEditor = (value, path) => {
    if (typeof value === "string") {
      return (
        <input
          type="text"
          className={classNames.input}
          value={value}
          onChange={(event) => handleFieldChange(path, event.target.value)}
        />
      );
    }

    if (typeof value === "number") {
      return (
        <input
          type="number"
          className={classNames.input}
          value={value}
          onChange={(event) => handleFieldChange(path, Number(event.target.value))}
        />
      );
    }

    if (typeof value === "boolean") {
      return (
        <label className="inline-flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
            checked={value}
            onChange={(event) => handleFieldChange(path, event.target.checked)}
          />
          Enabled
        </label>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-4">
          {value.map((item, index) => (
            <div key={`${path}.${index}`} className="array-item space-y-2 rounded-md border border-gray-200  p-4">
              {renderValueEditor(item, `${path}.${index}`)}
              <button
                type="button"
                className={`${classNames.btn} ${classNames.btnDanger}`}
                onClick={() => handleArrayRemove(path, index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={`${classNames.btn} ${classNames.btnSecondary}`}
            onClick={() => handleArrayAdd(path)}
          >
            Add Item
          </button>
        </div>
      );
    }

    if (value && typeof value === "object") {
      return (
        <div className="object-group space-y-4">
          {Object.entries(value).map(([innerKey, innerValue]) => (
            <div key={`${path}.${innerKey}`} className="field-group">
              <label className="field-label text-sm font-medium text-white">
                {formatLabel(innerKey)}
              </label>
              {renderValueEditor(innerValue, `${path}.${innerKey}`)}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderForm = () => {
    if (!currentSection || !jsonData?.[currentSection]) {
      return <p className="text-sm text-gray-500">Select a section from the sidebar to edit.</p>;
    }

    const sectionData = jsonData[currentSection];

    if (sectionData && typeof sectionData === "object" && !Array.isArray(sectionData)) {
      return (
        <div className="space-y-6">
          {Object.entries(sectionData).map(([key, value]) => (
            <div key={key} className="field-group">
              <label className="field-label text-sm font-semibold text-white">
                {formatLabel(key)}
              </label>
              {renderValueEditor(value, `${currentSection}.${key}`)}
            </div>
          ))}
        </div>
      );
    } 

    return renderValueEditor(sectionData, currentSection);
  };

  const handleToggleSidebar = useCallback((event) => {
    if (event) {
      event.stopPropagation();
    }
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleToggleProfile = useCallback((event) => {
    if (event) {
      event.stopPropagation();
    }
    setIsProfileOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#05070a] text-white">
      <div className="hidden xl:block">
        <LeftSidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <Header
          title="Admin Panel"
          onToggleSidebar={handleToggleSidebar}
          showSidebarToggle
          showNewProjectButtons
          onCreateProject={() => navigate("/dashboard")}
          showProfile
          onToggleProfile={handleToggleProfile}
          isProfileOpen={isProfileOpen}
          userName={userName}
          showCreditButton
          onCreditClick={() => navigate("/pricing")}
        />

        <main className="flex flex-1">

          <aside className="sidebar hidden w-60 shrink-0 border-r border-white/10 bg-[#070a12] px-5 py-6 lg:block lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <img src="https://inaiverse.com/assets/INAI-DcQcSw2x.png" alt="logo" className="h-28 w-28" />
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section}
                  type="button"
                  className={`${classNames.navLink} ${currentSection === section ? classNames.activeNavLink : ""}`}
                  onClick={() => setCurrentSection(section)}
                >
                  <FaFolder />
                  <span>{formatLabel(section)}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 overflow-y-auto p-6 xl:p-5 add-background">

            <div className="nav  mb-2 flex flex-col p-5 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
              <div className="text-[15px] text-white">Add Member</div>

              <div className="relative w-full max-w-xl">
                <IoMdSearch className="fas fa-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-[8px] border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm text-white placeholder-white/40 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                />
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-lg transition hover:border-white/20 hover:bg-white/10"
                  aria-label="Toggle dark mode"
                >
                  <FaMoon />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-lg transition hover:border-white/20 hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <FaRegBell />
                </button>
                <div className="flex h-10 w-10">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="user photo" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10" />
                </div>
                <MdKeyboardArrowDown className="h-5 w-5"/>
              </div>
            </div>

            <section className=" p-6 shadow-lg add-background">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Panel Controls</h2>
                  <p className="text-sm text-white/70">Switch between form and raw JSON editing modes.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-medium ${
                        activeView === "form"
                          ? "bg-blue-600 text-white"
                          : "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                      }`}
                      onClick={() => setActiveView("form")}
                    >
                      Form View
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-medium ${
                        activeView === "raw"
                          ? "bg-blue-600 text-white"
                          : "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                      }`}
                      onClick={() => setActiveView("raw")}
                    >
                      Raw JSON
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`${classNames.btn} ${classNames.btnSecondary}`}
                    onClick={loadJson}
                  >
                    <i className="fas fa-sync-alt"></i>
                    Reload JSON
                  </button>
                  <button
                    type="button"
                    className={`${classNames.btn} ${classNames.btnPrimary}`}
                    onClick={saveJson}
                  >
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                </div>
              </div>

              {message.text ? (
                <div
                  className={`mt-4 text-sm ${
                    message.type === "error"
                      ? "bg-red-500/20 text-red-100"
                      : message.type === "success"
                        ? "bg-green-500/20 text-green-100"
                        : "bg-blue-500/20 text-blue-100"
                  } rounded-md px-3 py-2`}
                >
                  {message.text}
                </div>
              ) : null}
            </section>

            <section className="mt-6 space-y-6">
              {activeView === "form" ? (
                <div className="add-background">
                  <div className="space-y-6">
                    {renderForm()}
                    {currentSection ? null : (
                      <p className="text-sm text-white/70">Select a section from the sidebar to edit.</p>
                    )}
                  </div>
                </div>
              ) : null}

              {activeView === "raw" ? (
                <div className="add-background">
                  <h2 className="text-xl font-semibold text-white">Raw JSON Editor</h2>
                  <p className="mb-4 text-sm text-white/70">
                    Edit the raw JSON content below. Ensure valid JSON syntax.
                  </p>
                  <textarea
                    className="w-full min-h-[400px] rounded-lg border border-white/20 bg-white/10 p-4 font-mono text-sm text-white placeholder-white/60"
                    value={jsonEditorValue}
                    onChange={(event) => {
                      setJsonEditorValue(event.target.value);
                      try {
                        const parsed = JSON.parse(event.target.value);
                        setJsonData(parsed);
                        showMessage("JSON syntax valid", "success");
                      } catch (error) {
                        showMessage(`Invalid JSON: ${error.message}`, "error");
                      }
                    }}
                  />
                </div>
              ) : null}
            </section>

          </div>
        </main>
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 flex bg-black/70 xl:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div
            className="h-full w-72 max-w-[80vw]"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <LeftSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
          <div className="flex-1" />
        </div>
      ) : null}
    </div>
  );
};

export default Admin;
