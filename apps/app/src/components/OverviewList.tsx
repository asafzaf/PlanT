import OverviewCard from "./OverviewCard";
import { FinancialOverviewContent } from "./FinancialOverviewContent";
import { RecentProjectsContent } from "./RecentProjectsContent";
import type { Dictionary } from "../i18n/i18n";

type OverviewListProps = {
  data: Dictionary;
};

export default function OverviewList({ data }: OverviewListProps) {
  return (
    <div className="overview_grid">
      <OverviewCard title={data.recentProjects.label}>
        <RecentProjectsContent projects={data.recentProjects.projects} />
      </OverviewCard>
      <OverviewCard title={data.financialOverview.label}>
        <FinancialOverviewContent finance={data.financialOverview} />
      </OverviewCard>
    </div>
  );
}
