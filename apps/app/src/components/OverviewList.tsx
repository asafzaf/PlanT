import OverviewCard from "./OverviewCard";
import overviewData from "../dummyData/overviewData.json";
import { FinancialOverviewContent } from "./FinancialOverviewContent";
import { RecentProjectsContent } from "./RecentProjectsContent";
import type { Project } from "./RecentProjectsContent";

export default function OverviewList() {
  const { financialOverview, recentProjects } = overviewData;

  return (
    <div className="overview_grid">
      <OverviewCard title="פרויקטים אחרונים">
        <RecentProjectsContent projects={recentProjects as Project[]} />
      </OverviewCard>
      <OverviewCard title="סקירה פיננסית">
        <FinancialOverviewContent {...financialOverview} />
      </OverviewCard>
    </div>
  );
}
