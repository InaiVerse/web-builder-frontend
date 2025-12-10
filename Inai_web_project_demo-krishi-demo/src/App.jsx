import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./Web-Builder/Components/SignUp/SignUp";
import SignIn from "./Web-Builder/Components/SignIn/SignInFlow";
import Input from "./Web-Builder/Components/Recomandation/Input";
import WebBuilderInput from "./Web-Builder/Components/Recomandation/Input";
import Form1 from "./Web-Builder/Components/Recomandation/Form1";
import Admin from "./Web-Builder/Components/Dashboard/Admin";
import Home from "./Web-Builder/Components/Home/Home";
import Theme from "./Web-Builder/Components/Recomandation/Theme";
import Pages from "./Web-Builder/Components/Recomandation/Pages";
import Dashboard from "./Web-Builder/Components/Dashboard/Dashboard";
import Pricing from "./Web-Builder/Components/Dashboard/Pricing";
import Chart from "./Web-Builder/Components/Dashboard/Chart";
import Settings from "./Web-Builder/Components/Settings/Settings";
import Profile from "./Web-Builder/Components/Settings/Profile";
import Appearance from "./Web-Builder/Components/Settings/Appearance";
import Help from "./Web-Builder/Components/Dashboard/Help";
import Updates from "./Web-Builder/Components/Dashboard/Updates";
import UpdateDetail from "./Web-Builder/Components/Dashboard/UpdateDetail";
import BuilderPage from './Web-Builder/app/builder/page.jsx';
import JoinPage from './Project-Builder/JoinProject/JoinPage';
import InputPage from './Project-Builder/Input/input.jsx';
import ProjectBuilderDashboard from './Project-Builder/Dashboard/Dashboard.jsx';
import ChatEditor from './Project-Builder/ChatEditor/ChatEditor.jsx';
import ProjectBuilderPage from './Project-Builder/VsCode/ProjectBuilderPage.jsx';
import PublicRoute from "./Web-Builder/Components/Utils/PublicRoute";
import ProtectedRoute from "./Web-Builder/Components/Utils/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route path="/" element={<Navigate to="/Home" replace />} />

        {/* Original Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Project Builder Routes */}
        <Route path="/project-builder">
          <Route
            index
            element={
              <ProtectedRoute>
                <Navigate to="joinproject" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="joinproject"
            element={
              <ProtectedRoute>
                <JoinPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="input"
            element={
              <ProtectedRoute>
                <InputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <ProjectBuilderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="chat-editor"
            element={
              <ProtectedRoute>
                <ChatEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="builder"
            element={
              <ProtectedRoute>
                <ProjectBuilderPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Web Builder Routes */}
        <Route path="/web-builder">
          <Route
            index
            element={
              <ProtectedRoute>
                <Navigate to="dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="input"
            element={
              <ProtectedRoute>
                <WebBuilderInput />
              </ProtectedRoute>
            }
          />
          <Route
            path="web-builder"
            element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Web Builder</h1>
                  {/* Add Web Builder content here */}
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="ide"
            element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">IDE</h1>
                  {/* Add IDE content here */}
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
          <Route
            path="updates"
            element={
              <ProtectedRoute>
                <Updates />
              </ProtectedRoute>
            }
          />
          <Route
            path="updates/:id"
            element={
              <ProtectedRoute>
                <UpdateDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="builder"
            element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="monitoring"
            element={
              <ProtectedRoute>
                <Chart />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="appearance"
            element={
              <ProtectedRoute>
                <Appearance />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Other redirects */}
        <Route path="/pricing" element={<Navigate to="/web-builder/pricing" replace />} />
        <Route path="/help" element={<Navigate to="/web-builder/help" replace />} />
        <Route path="/updates" element={<Navigate to="/web-builder/updates" replace />} />
        <Route path="/builder" element={<Navigate to="/web-builder/builder" replace />} />
        <Route path="/Monitoring" element={<Navigate to="/web-builder/monitoring" replace />} />
        <Route path="/Settings" element={<Navigate to="/web-builder/settings" replace />} />
        <Route path="/Profile" element={<Navigate to="/web-builder/profile" replace />} />
        <Route path="/Appearance" element={<Navigate to="/web-builder/appearance" replace />} />

        {/* OTHER PROTECTED ROUTES */}
        <Route
          path="/Home"
          element={<Home />}
        />

        {/* <Route
          path="/input"
          element={
            <ProtectedRoute>
              <Input />
            </ProtectedRoute>
          }
        />

        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <Form1 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Theme"
          element={
            <ProtectedRoute>
              <Theme />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Pages"
          element={
            <ProtectedRoute>
              <Pages />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;