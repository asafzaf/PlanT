import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";
import Dashboard from "../src/components/Pages/Dashborad";
import Projects from "../src/components/Pages/Projects";
import CreateProject from "../src/components/Pages/CreateProject";
import LoginPage from "../src/pages/LoginPage";
import { useI18n } from "./i18n/useI18n";
import { useUsers } from "./hooks/userHook.ts";
import { useAuth } from "./context/AuthContext";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function App() {
  const { t, toggleLang } = useI18n();
  const { data: users, error, isLoading } = useUsers();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  function getPageTitle(pathname: string): string {
    switch (pathname) {
      case "/":
        return t.nav.dashboard;
      case "/projects":
        return t.nav.projects;
      case "/expenses":
        return t.nav.expenses;
      case "/income":
        return t.nav.incomes;
      case "/monthly":
        return t.nav.monthly;
      default:
        return t.nav.dashboard;
    }
  }

  const pageTitle = getPageTitle(location.pathname);

  // If not authenticated, show only login route
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If authenticated, show main app layout with protected routes
  return (
    <div className="app_container">
      <Nav
        name={t.businessName}
        description={t.businessDescription}
        t={t.nav}
      ></Nav>
      <div className="main_content">
        <Header name={pageTitle}>
          <button className="lang_btn" onClick={toggleLang}>
            {t.toggle}
          </button>
        </Header>
        <MainContent>
          <Routes>
            {/* Protected Routes */}
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
            {/* <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} /> */}
            {/* <Route path="/income" element={<ProtectedRoute><IncomePage /></ProtectedRoute>} /> */}
            {/* <Route path="/monthly" element={<ProtectedRoute><MonthlyPage /></ProtectedRoute>} /> */}

            {/* Redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
}

export default App;
