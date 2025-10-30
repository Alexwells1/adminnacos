import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CensusService,
  type CensusFormData,
  type StatisticsData,
} from "./census-service";
import { OverviewCards } from "./overview-cards";
import { StatisticsGrid } from "./statistics-grid";
import { ParticipantsTable } from "./participants-table";
import { LearningGoalsView } from "./learning-goals-view";
import { AllInterestsView } from "./all-interests-view";
import { DepartmentAnalysis } from "./department-analysis";

const censusService = new CensusService();

export default function PublicStatistics() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<CensusFormData[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadStatistics();
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      setLoadingResponses(true);
      const result = await censusService.getAllResponses();
      if (result.success && result.data) {
        setResponses(result.data);
        toast.success("Responses loaded successfully");
      } else {
        toast.error("Failed to load responses");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load responses");
    } finally {
      setLoadingResponses(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const result = await censusService.getStatistics();
      if (result.success && result.data) {
        setStats(result.data);
        toast.success("Statistics loaded successfully");
      } else {
        toast.error("Failed to load statistics");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadStatistics();
    loadResponses();
  };

  if (loading) return <StatisticsSkeleton />;

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-semibold">Failed to load statistics</p>
            </div>
            <Button onClick={handleRetry}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          NACOS Skills Census 2025
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Insights from our community of {stats.totalStudents.toLocaleString()}{" "}
          tech enthusiasts
        </p>
        <Button asChild variant="outline" className="mt-4">
          <a href="/tech-survey">← Back to Census Form</a>
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 p-1 bg-muted/50">
          <TabsTrigger value="overview" className="text-sm">
            📊 Overview
          </TabsTrigger>
          <TabsTrigger value="participants" className="text-sm">
            👥 Participants
          </TabsTrigger>
          <TabsTrigger value="learning-goals" className="text-sm">
            🎯 Learning Goals
          </TabsTrigger>
          <TabsTrigger value="interests" className="text-sm">
            💡 All Interests
          </TabsTrigger>
          <TabsTrigger value="departments" className="text-sm">
            🏫 Departments
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-sm">
            📈 Analysis
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewCards stats={stats} />
          <StatisticsGrid stats={stats} responses={responses} />
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants">
          <ParticipantsTable
            responses={responses}
            loading={loadingResponses}
            stats={stats}
          />
        </TabsContent>

        {/* Learning Goals Tab */}
        <TabsContent value="learning-goals">
          <LearningGoalsView responses={responses} loading={loadingResponses} />
        </TabsContent>

        {/* All Interests Tab */}
        <TabsContent value="interests">
          <AllInterestsView
            responses={responses}
            stats={stats}
            loading={loadingResponses}
          />
        </TabsContent>

        {/* Department Analysis Tab */}
        <TabsContent value="departments">
          <DepartmentAnalysis
            responses={responses}
            stats={stats}
            loading={loadingResponses}
          />
        </TabsContent>

        {/* Detailed Analysis Tab */}
        <TabsContent value="analysis">
          <DetailedAnalysis
            responses={responses}
            stats={stats}
            loading={loadingResponses}
          />
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Haven't participated yet?
            </h3>
            <p className="text-gray-600 mb-4">
              Join {stats.totalStudents.toLocaleString()} students who have
              shared their tech journey
            </p>
            <Button asChild size="lg">
              <a href="/tech-survey">Take the Census Now</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Detailed Analysis Component
function DetailedAnalysis({
  responses,
  loading,
}: {
  responses: CensusFormData[];
  stats: StatisticsData;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Calculate department-level combinations
  const departmentLevelStats = responses.reduce((acc, response) => {
    const key = `${response.department}-${response.level}`;
    if (!acc[key]) {
      acc[key] = {
        department: response.department,
        level: response.level,
        count: 0,
        skills: {} as Record<string, number>,
        languages: {} as Record<string, number>,
        projectCell: { yes: 0, no: 0 },
      };
    }
    acc[key].count++;

    // Track skills
    acc[key].skills[response.programmingSkill] =
      (acc[key].skills[response.programmingSkill] || 0) + 1;

    // Track languages
    response.languages.forEach((lang) => {
      acc[key].languages[lang] = (acc[key].languages[lang] || 0) + 1;
    });

    // Track project cell interest
    if (response.projectCell === "yes") {
      acc[key].projectCell.yes++;
    } else {
      acc[key].projectCell.no++;
    }

    return acc;
  }, {} as Record<string, any>);

  const combinations = Object.values(departmentLevelStats).sort(
    (a: any, b: any) => b.count - a.count
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Department & Level Combination Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of responses by department and academic level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {combinations.map((combo: any, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {combo.department}
                    </h3>
                    <p className="text-muted-foreground">{combo.level} Level</p>
                  </div>
                  <Badge variant="default" className="text-lg">
                    {combo.count} students
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Skill Distribution</h4>
                    {Object.entries(combo.skills).map(
                      ([skill, count]: [string, any]) => (
                        <div key={skill} className="flex justify-between">
                          <span className="capitalize">{skill}</span>
                          <span>
                            {count} ({((count / combo.count) * 100).toFixed(1)}
                            %)
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Top Languages</h4>
                    {Object.entries(combo.languages)
                      .sort(
                        ([, a]: [string, any], [, b]: [string, any]) => b - a
                      )
                      .slice(0, 3)
                      .map(([lang, count]: [string, any]) => (
                        <div key={lang} className="flex justify-between">
                          <span>{lang}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Project Cell</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Interested</span>
                        <span>
                          {combo.projectCell.yes} (
                          {(
                            (combo.projectCell.yes / combo.count) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Not Interested</span>
                        <span>
                          {combo.projectCell.no} (
                          {((combo.projectCell.no / combo.count) * 100).toFixed(
                            1
                          )}
                          %)
                        </span>
                      </div>
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

function StatisticsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-12 w-full mb-3" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
