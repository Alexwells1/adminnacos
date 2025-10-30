// components/department-analysis.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatisticsData, CensusFormData } from "./census-service";

interface DepartmentAnalysisProps {
  responses: CensusFormData[];
  stats: StatisticsData;
  loading: boolean;
}

export function DepartmentAnalysis({
  responses,
  stats,
  loading,
}: DepartmentAnalysisProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Calculate department statistics
  const departmentStats = stats.departmentStats.map((dept) => {
    const departmentResponses = responses.filter(
      (r) => r.department === dept._id
    );

    const levelDistribution = departmentResponses.reduce((acc, response) => {
      acc[response.level] = (acc[response.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const skillDistribution = departmentResponses.reduce((acc, response) => {
      acc[response.programmingSkill] =
        (acc[response.programmingSkill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLanguages = departmentResponses
      .flatMap((r) => r.languages)
      .reduce((acc, lang) => {
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const projectCellInterest = departmentResponses.filter(
      (r) => r.projectCell === "yes"
    ).length;

    return {
      ...dept,
      levelDistribution,
      skillDistribution,
      topLanguages: Object.entries(topLanguages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3),
      projectCellInterest,
      percentage: (dept.count / stats.totalStudents) * 100,
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of participation and skills by department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departmentStats.map((dept, index) => (
              <Card key={dept._id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      {dept._id}
                    </h3>
                    <p className="text-muted-foreground">
                      {dept.count} students ({dept.percentage.toFixed(1)}% of
                      total)
                    </p>
                  </div>
                  <Badge variant="default" className="text-lg">
                    {dept.count}
                  </Badge>
                </div>

                {/* Progress bar showing department proportion */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Department Proportion</span>
                    <span>{dept.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* Level Distribution */}
                  <div>
                    <h4 className="font-semibold mb-2">Level Distribution</h4>
                    {Object.entries(dept.levelDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([level, count]) => (
                        <div key={level} className="flex justify-between mb-1">
                          <span>{level}</span>
                          <span>
                            {count} ({((count / dept.count) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Skill Distribution */}
                  <div>
                    <h4 className="font-semibold mb-2">Skill Levels</h4>
                    {Object.entries(dept.skillDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([skill, count]) => (
                        <div key={skill} className="flex justify-between mb-1">
                          <span className="capitalize">{skill}</span>
                          <span>
                            {count} ({((count / dept.count) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Additional Stats */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Project Cell Interest</span>
                        <span>
                          {dept.projectCellInterest} (
                          {(
                            (dept.projectCellInterest / dept.count) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Top Languages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dept.topLanguages.map(([lang, count]) => (
                            <Badge
                              key={lang}
                              variant="outline"
                              className="text-xs"
                            >
                              {lang} ({count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Highlights */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2 text-sm">
                    Department Highlights:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-semibold">
                        {Math.max(...Object.values(dept.levelDistribution))}
                      </div>
                      <div>Most Common Level</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-semibold capitalize">
                        {
                          Object.entries(dept.skillDistribution).sort(
                            ([, a], [, b]) => b - a
                          )[0]?.[0]
                        }
                      </div>
                      <div>Dominant Skill</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-semibold">
                        {dept.topLanguages[0]?.[0]}
                      </div>
                      <div>Top Language</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-semibold">
                        {(
                          (dept.projectCellInterest / dept.count) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div>Project Interest</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
