import CardList from "../CardList";
import OverviewList from "../OverviewList";
import { QuickActionsCard } from "../QuickActionCard";
import cardData from "../../dummyData/cardData.json";

export default function Dashboard() {
  return (
    <div className="main_container">
      <CardList cards={cardData} />
      <OverviewList />
      <QuickActionsCard />
    </div>
  );
}
