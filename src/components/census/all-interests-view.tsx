// components/all-interests-view.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatisticsData, CensusFormData } from "./census-service";

interface AllInterestsViewProps {
  responses: CensusFormData[];
  stats: StatisticsData;
  loading: boolean;
}

export function AllInterestsView({
  responses,
  stats,
  loading,
}: AllInterestsViewProps) {
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

  // Calculate interest statistics
  const interestStats = stats.popularInterests.map((interest) => {
    const students = responses.filter((r) =>
      r.interests.includes(interest._id)
    );
    const skillDistribution = students.reduce((acc, student) => {
      acc[student.programmingSkill] = (acc[student.programmingSkill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const levelDistribution = students.reduce((acc, student) => {
      acc[student.level] = (acc[student.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...interest,
      students,
      skillDistribution,
      levelDistribution,
      projectCellInterest: students.filter((s) => s.projectCell === "yes")
        .length,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Interest Areas</CardTitle>
        <CardDescription>
          Comprehensive breakdown of all interest areas and student demographics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {interestStats.map((interest, index) => (
            <Card key={interest._id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    {interest._id}
                  </h3>
                  <p className="text-muted-foreground">
                    {interest.count} students (
                    {((interest.count / stats.totalStudents) * 100).toFixed(1)}%
                    of total)
                  </p>
                </div>
                <Badge variant="default" className="text-lg">
                  {interest.count}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* Skill Distribution */}
                <div>
                  <h4 className="font-semibold mb-2">Skill Levels</h4>
                  {Object.entries(interest.skillDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([skill, count]) => (
                      <div key={skill} className="flex justify-between mb-1">
                        <span className="capitalize">{skill}</span>
                        <span>
                          {count} ({((count / interest.count) * 100).toFixed(1)}
                          %)
                        </span>
                      </div>
                    ))}
                </div>

                {/* Level Distribution */}
                <div>
                  <h4 className="font-semibold mb-2">Academic Levels</h4>
                  {Object.entries(interest.levelDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([level, count]) => (
                      <div key={level} className="flex justify-between mb-1">
                        <span>{level}</span>
                        <span>
                          {count} ({((count / interest.count) * 100).toFixed(1)}
                          %)
                        </span>
                      </div>
                    ))}
                </div>

                {/* Additional Stats */}
                <div>
                  <h4 className="font-semibold mb-2">Additional Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Project Cell Interest</span>
                      <span>
                        {interest.projectCellInterest} (
                        {(
                          (interest.projectCellInterest / interest.count) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Languages</span>
                      <span>
                        {Array.from(
                          new Set(interest.students.flatMap((s) => s.languages))
                        )
                          .slice(0, 2)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Students */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm">
                  Sample of Interested Students:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {interest.students.slice(0, 6).map((student, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {student.name} ({student.level})
                    </Badge>
                  ))}
                  {interest.students.length > 6 && (
                    <Badge variant="secondary" className="text-xs">
                      +{interest.students.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
