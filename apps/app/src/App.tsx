import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";
import Dashboard from "../src/components/Pages/Dashborad";
import Projects from "../src/components/Pages/Projects";
import { useI18n } from "./i18n/useI18n";
import { useUsers } from "./hooks/userHook.ts";

function App() {
  const { t, toggleLang } = useI18n();
  const { data: users, error, isLoading } = useUsers();
  const location = useLocation();

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  console.log("Fetched users:", users);

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
            <Route path="/" element={<Dashboard t={t} />} />
            <Route path="/projects" element={<Projects />} />
            {/* <Route path="/expenses" element={<ExpensesPage />} /> */}
            {/* <Route path="/income" element={<IncomePage />} /> */}
            {/* <Route path="/monthly" element={<MonthlyPage />} /> */}
          </Routes>
        </MainContent>
      </div>
    </div>
  );
}

export default App;
