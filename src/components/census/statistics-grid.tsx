// components/statistics-grid.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StatisticsData, CensusFormData } from "./census-service";

interface StatisticsGridProps {
  stats: StatisticsData;
  responses: CensusFormData[];
}

export function StatisticsGrid({ stats, responses }: StatisticsGridProps) {
  const topInterests = stats.popularInterests.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Popular Programming Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💻</span> Top Programming Languages
          </CardTitle>
          <CardDescription>
            Most used languages in our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.popularLanguages.map((lang, index) => (
              <LanguageBar
                key={lang._id}
                language={lang._id}
                count={lang.count}
                total={stats.totalStudents}
                rank={index + 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interest Areas with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span> Top Interest Areas
          </CardTitle>
          <CardDescription>What students want to learn</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={topInterests[0]?._id || "all"} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {topInterests.map((interest, index) => (
                <TabsTrigger key={interest._id} value={interest._id}>
                  #{index + 1} {interest._id}
                </TabsTrigger>
              ))}
            </TabsList>
            {topInterests.map((interest) => (
              <TabsContent key={interest._id} value={interest._id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{interest._id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {interest.count} students interested
                      </p>
                    </div>
                    <Badge variant="default">
                      {((interest.count / stats.totalStudents) * 100).toFixed(
                        1
                      )}
                      %
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Students interested in this area:</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {responses
                        .filter((r) => r.interests.includes(interest._id))
                        .slice(0, 8)
                        .map((student, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {student.name}
                          </Badge>
                        ))}
                      {responses.filter((r) =>
                        r.interests.includes(interest._id)
                      ).length > 8 && (
                        <Badge variant="secondary" className="text-xs">
                          +
                          {responses.filter((r) =>
                            r.interests.includes(interest._id)
                          ).length - 8}{" "}
                          more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Skill Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span> Skill Level Distribution
          </CardTitle>
          <CardDescription>Programming experience levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.skillStats.map((skill) => (
              <SkillLevel
                key={skill._id}
                level={skill._id}
                count={skill.count}
                total={stats.totalStudents}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎓</span> Academic Levels
          </CardTitle>
          <CardDescription>Participants by year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.levelStats.map((level) => (
              <LevelBadge
                key={level._id}
                level={level._id}
                count={level.count}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-components
function LanguageBar({
  language,
  count,
  total,
  rank,
}: {
  language: string;
  count: number;
  total: number;
  rank: number;
}) {
  const percentage = (count / total) * 100;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Badge
          variant="secondary"
          className="w-8 h-8 flex items-center justify-center"
        >
          {rank}
        </Badge>
        <span className="font-medium text-sm flex-1">{language}</span>
        <span className="text-sm text-muted-foreground w-12 text-right">
          {count}
        </span>
      </div>
      <Progress value={percentage} className="w-20 ml-4" />
    </div>
  );
}

function SkillLevel({
  level,
  count,
  total,
}: {
  level: string;
  count: number;
  total: number;
}) {
  const percentage = (count / total) * 100;
  const levelColors: Record<string, string> = {
    beginner: "bg-blue-500",
    intermediate: "bg-green-500",
    advanced: "bg-orange-500",
    expert: "bg-purple-500",
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium capitalize">{level}</span>
        <span className="text-muted-foreground">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${levelColors[level] || "bg-gray-300"}`}
      />
    </div>
  );
}

function LevelBadge({ level, count }: { level: string; count: number }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <span className="font-semibold">{level}</span>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
}
