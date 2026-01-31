"use client";

import { useState } from "react";
import { CalendarCheck, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useStore } from "@/lib/store";

export function AttendanceTable() {
  const { state } = useStore();
  const [filterEmployee, setFilterEmployee] = useState<string>("all");

  if (state.isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const filteredAttendance =
    filterEmployee === "all"
      ? state.attendance
      : state.attendance.filter((a) => a.employeeId === filterEmployee);

  const sortedAttendance = [...filteredAttendance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getEmployeeName = (employeeId: string) => {
    const employee = state.employees.find((e) => e.id === employeeId);
    return employee?.fullName ?? "Unknown Employee";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (state.attendance.length === 0) {
    return (
      <EmptyState
        icon={<CalendarCheck className="h-8 w-8 text-muted-foreground" />}
        title="No attendance records"
        description="Start tracking attendance by marking employees present or absent."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterEmployee} onValueChange={setFilterEmployee}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {state.employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filterEmployee !== "all" && (
          <Button variant="ghost" size="sm" onClick={() => setFilterEmployee("all")}>
            Clear filter
          </Button>
        )}
      </div>

      {sortedAttendance.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="h-8 w-8 text-muted-foreground" />}
          title="No records found"
          description="No attendance records match the selected filter."
          action={
            <Button variant="outline" onClick={() => setFilterEmployee("all")}>
              Clear filter
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell className="font-mono text-sm">{record.employeeId}</TableCell>
                <TableCell className="font-medium">{getEmployeeName(record.employeeId)}</TableCell>
                <TableCell>
                  <Badge variant={record.status === "present" ? "success" : "destructive"}>
                    {record.status === "present" ? "Present" : "Absent"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
