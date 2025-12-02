import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";
import Dashboard from "./components/Pages/Dashboard";

// Dummy data
const userName = "יוסי";
const businessName = "Atias & Mor";
const businessDescription = "ניהול שיפוצים";

import { useUsers } from "./hooks/userHook.ts";

function App() {
  const { data: users, error, isLoading } = useUsers();
  const location = useLocation();

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  console.log("Fetched users:", users);

  function getPageTitle(pathname: string): string {
    switch (pathname) {
      case "/":
        return "לוח בקרה";
      case "/projects":
        return "פרויקטים";
      case "/expenses":
        return "הוצאות";
      case "/income":
        return "הכנסות";
      case "/monthly":
        return "מעקב חודשי";
      default:
        return "לוח בקרה";
    }
  }

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="app_container">
      <Nav name={businessName} description={businessDescription}></Nav>
      <div className="main_content">
        <Header name={pageTitle}>{userName}</Header>
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/projects" element={<Projects />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/monthly" element={<MonthlyPage />} /> */}
          </Routes>
        </MainContent>
      </div>
    </div>
  );
}

export default App;
