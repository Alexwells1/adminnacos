import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { Payment } from "@/types/admin.types";

interface DepartmentStudentsTabProps {
  students: Payment[];
}

export const DepartmentStudentsTab: React.FC<DepartmentStudentsTabProps> = ({
  students,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredStudents = useMemo(() => {
    if (!students) return [];

    let filtered = students;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(term) ||
          student.matricNumber.toLowerCase().includes(term) ||
          student.email?.toLowerCase().includes(term) ||
          student.level.includes(term)
      );
    }

    if (filterLevel) {
      filtered = filtered.filter((student) => student.level === filterLevel);
    }

    return filtered;
  }, [students, searchTerm, filterLevel]);

  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterLevel(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Student Payments
        </h2>
        <div className="text-sm text-muted-foreground">
          {filteredStudents.length} students found
        </div>
      </div>

      {/* Search Component */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search Students
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, matric number, or level..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select
                  value={filterLevel || ""}
                  onValueChange={(value) => setFilterLevel(value || null)}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {["100", "200", "300", "400", "500"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="h-10 gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      {filteredStudents.length > 0 ? (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Department Students</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Student</th>
                    <th className="text-left p-4 font-medium">Matric No</th>
                    <th className="text-left p-4 font-medium">Level</th>
                    <th className="text-right p-4 font-medium">Amount</th>
                    <th className="text-right p-4 font-medium">Date</th>
                    <th className="text-right p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium">{student.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                      </td>
                      <td className="p-4">{student.matricNumber}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-blue-50">
                          {student.level} Level
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-medium">
                        ₦{student.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {new Date(student.paidAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Badge
                          variant={
                            student.status === "completed"
                              ? "default"
                              : student.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {student.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredStudents.length
                    )}{" "}
                    of {filteredStudents.length} results
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">No students found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterLevel
                ? "Try adjusting your search criteria"
                : "No student data available for this department"}
            </p>
            {(searchTerm || filterLevel) && (
              <Button onClick={clearFilters}>Clear Search</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
