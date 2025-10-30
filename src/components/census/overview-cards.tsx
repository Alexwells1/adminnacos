// components/overview-cards.tsx
import { Card, CardContent } from "@/components/ui/card";
import type { StatisticsData } from "./census-service";

interface OverviewCardsProps {
  stats: StatisticsData;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const projectCellCount =
    stats.projectCellStats.find((s) => s._id === "yes")?.count || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Participants"
        value={stats.totalStudents.toLocaleString()}
        description="Students who joined the census"
        icon="👥"
      />
      <StatCard
        title="Recent Submissions"
        value={stats.recentSubmissions.toLocaleString()}
        description="In the last 7 days"
        icon="🆕"
      />
      <StatCard
        title="Project Cell Interest"
        value={`${Math.round((projectCellCount / stats.totalStudents) * 100)}%`}
        description="Ready to collaborate"
        icon="🚀"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
