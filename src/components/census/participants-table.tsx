// components/participants-table.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { StatisticsData, CensusFormData } from "./census-service";

interface ParticipantsTableProps {
  responses: CensusFormData[];
  loading: boolean;
  stats: StatisticsData;
}

export function ParticipantsTable({
  responses,
  loading,
}: ParticipantsTableProps) {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterSkill, setFilterSkill] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredResponses = responses.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === "All" || r.level === filterLevel;
    const matchesDept =
      filterDepartment === "All" || r.department === filterDepartment;
    const matchesSkill =
      filterSkill === "All" || r.programmingSkill === filterSkill;

    return matchesSearch && matchesLevel && matchesDept && matchesSkill;
  });

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
        <CardTitle>Participants Overview</CardTitle>
        <CardDescription>
          Browse all participants with search and filters
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <Input
            placeholder="🔍 Search by name..."
            className="w-full md:w-1/3"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex flex-wrap gap-3">
            <Select
              value={filterLevel}
              onValueChange={(value) => {
                setFilterLevel(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                {Array.from(new Set(responses.map((r) => r.level))).map(
                  (lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={filterDepartment}
              onValueChange={(value) => {
                setFilterDepartment(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {Array.from(new Set(responses.map((r) => r.department))).map(
                  (dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={filterSkill}
              onValueChange={(value) => {
                setFilterSkill(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Skills</SelectItem>
                {Array.from(
                  new Set(responses.map((r) => r.programmingSkill))
                ).map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredResponses.length} of {responses.length} participants
          {(search ||
            filterLevel !== "All" ||
            filterDepartment !== "All" ||
            filterSkill !== "All") &&
            " (filtered)"}
        </div>

        {/* Table */}
        {filteredResponses.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">
              {search ||
              filterLevel !== "All" ||
              filterDepartment !== "All" ||
              filterSkill !== "All"
                ? "No matching participants found."
                : "No participants available."}
            </p>
          </div>
        ) : (
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Skill Level</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Interests</TableHead>
                    <TableHead>Project Cell</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResponses.map((r, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.level}</Badge>
                      </TableCell>
                      <TableCell>{r.department}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.programmingSkill === "beginner"
                              ? "secondary"
                              : r.programmingSkill === "intermediate"
                              ? "default"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {r.programmingSkill}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {r.languages.slice(0, 2).map((lang, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {lang}
                            </Badge>
                          ))}
                          {r.languages.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{r.languages.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {r.interests.slice(0, 2).map((interest, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                          {r.interests.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{r.interests.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.projectCell === "yes" ? "default" : "secondary"
                          }
                        >
                          {r.projectCell}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

                <div className="text-center text-sm text-muted-foreground mt-2">
                  Showing {startIndex + 1}-
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredResponses.length
                  )}{" "}
                  of {filteredResponses.length} participants
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
