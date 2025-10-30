// components/learning-goals-view.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { CensusFormData } from "./census-service";

interface LearningGoalsViewProps {
  responses: CensusFormData[];
  loading: boolean;
}

export function LearningGoalsView({
  responses,
  loading,
}: LearningGoalsViewProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Filter responses with learning goals
  const responsesWithGoals = responses.filter(
    (r) => r.learningGoals && r.learningGoals.trim().length > 0
  );

  const filteredResponses = responsesWithGoals.filter(
    (r) =>
      r.learningGoals.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResponses = filteredResponses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Goals & Aspirations</CardTitle>
        <CardDescription>
          What our community members want to achieve (
          {responsesWithGoals.length} participants shared their goals)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="🔍 Search learning goals or names..."
            className="w-full md:w-1/2"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {responsesWithGoals.length}
            </div>
            <div className="text-sm text-muted-foreground">Shared Goals</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {((responsesWithGoals.length / responses.length) * 100).toFixed(
                1
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">
              Participation Rate
            </div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                responsesWithGoals.reduce(
                  (acc, r) => acc + r.learningGoals.length,
                  0
                ) / responsesWithGoals.length
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Avg. Goal Length
            </div>
          </div>
        </div>

        {/* Learning Goals Grid */}
        {filteredResponses.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">
              {search
                ? "No matching learning goals found."
                : "No learning goals available."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedResponses.map((response, index) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{response.name}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{response.level}</Badge>
                        <Badge variant="secondary" className="capitalize">
                          {response.programmingSkill}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {response.department}
                    </div>

                    <div className="text-sm leading-relaxed bg-muted/50 p-3 rounded-lg">
                      "{response.learningGoals}"
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {response.interests.slice(0, 3).map((interest, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {response.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{response.interests.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => {
                        const showEllipsis =
                          index > 0 && page - array[index - 1] > 1;
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-muted-foreground">
                                ...
                              </span>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page);
                                }}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        );
                      })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          );
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
