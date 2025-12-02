import "./App.css";
import Header from "./components/Header";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";
import CardList from "./components/CardList";
import OverviewList from "./components/OverviewList";
import { QuickActionsCard } from "./components/QuickActionCard";

// Dummy data
const userName = "יוסי";
const businessName = "Atias & Mor";
const businessDescription = "ניהול שיפוצים";
import cardData from "./dummyData/cardData.json";

import { useUsers } from "./hooks/userHook.ts";

function App() {
  const { data: users, error, isLoading } = useUsers();
  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  console.log("Fetched users:", users);

  return (
    <div className="app_container">
      <Nav name={businessName} description={businessDescription}>
        <ul>
          <li>📊 לוח בקרה</li>
          <li>📁 פרויקטים</li>
          <li>💸 הוצאות</li>
          <li>💰 הכנסות</li>
          <li>📅 מעקב חודשי</li>
        </ul>
      </Nav>
      <div className="main_content">
        <Header name="לוח בקרה">{userName}</Header>
        <MainContent>
          <CardList cards={cardData} />
          <OverviewList />
          <QuickActionsCard />
        </MainContent>
      </div>
    </div>
  );
}

export default App;
