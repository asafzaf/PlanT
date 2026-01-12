import "./App.css";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
} from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";
import Dashboard from "../src/components/Pages/Dashborad";
import Projects from "../src/components/Pages/Projects";
import Expenses from "../src/components/Pages/Expenses";
import ProjectDetails from "../src/components/Pages/ProjectDetails";
import CreateProject from "../src/components/Pages/CreateProject";
import LoginPage from "../src/components/Pages/LoginPage";
import { useI18n } from "./i18n/useI18n";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const { t, toggleLang } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  function getPageTitle(pathname: string): string {
    if (matchPath("/", pathname)) return t.nav.dashboard;
    if (matchPath("/projects", pathname)) return t.nav.projects;
    if (matchPath("/projects/new", pathname))
      return t.nav.newProject ?? "New project";
    if (matchPath("/projects/:internalId", pathname))
      return t.nav.projectDetails ?? "Project details";
    if (matchPath("/expenses", pathname)) return t.nav.expenses;
    if (matchPath("/income", pathname)) return t.nav.incomes;
    if (matchPath("/monthly", pathname)) return t.nav.monthly;

    return t.nav.dashboard;
  }

  const pageTitle = getPageTitle(location.pathname);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app_container">
      <Nav
        name={user?.businessName ?? t.businessName}
        description={user?.businessDescription ?? t.businessDescription}
        t={t.nav}
      >
        <button
          className="lang_toggle"
          onClick={toggleLang}
          aria-label="Toggle language"
        >
          <span className="lang_icon">🌐</span>
          <span className="lang_text">{t.toggle}</span>
        </button>
      </Nav>
      <div className="main_content">
        <Header name={pageTitle}>
          {/* <button
            className="lang_toggle"
            onClick={toggleLang}
            aria-label="Toggle language"
          >
            <span className="lang_icon">🌐</span>
            <span className="lang_text">{t.toggle}</span>
          </button> */}
        </Header>
        <MainContent>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard t={t} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects t={t} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/new"
              element={
                <ProtectedRoute>
                  <CreateProject t={t} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:internalId"
              element={
                <ProtectedRoute>
                  <ProjectDetails t={t} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Expenses t={t} />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/income" element={<ProtectedRoute><IncomePage /></ProtectedRoute>} /> */}
            {/* <Route path="/monthly" element={<ProtectedRoute><MonthlyPage /></ProtectedRoute>} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
}

export default App;
