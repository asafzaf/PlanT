import CardList from "../CardList";
import OverviewList from "../OverviewList";
import { QuickActionsCard } from "../QuickActionCard";
import type { Dictionary } from "../../i18n/i18n";

type DashboardProps = {
  t: Dictionary;
};

export default function Dashboard({ t }: DashboardProps) {
  return (
    <div className="main_container">
      <CardList cards={t.cardData} />
      <OverviewList data={t} />
      <QuickActionsCard actions={t.quickActions} />
    </div>
  );
}
