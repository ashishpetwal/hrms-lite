"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkAttendanceDialog } from "@/components/attendance/mark-attendance-dialog";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { useLoadData, useStore } from "@/lib/store";

export default function AttendancePage() {
  const loadData = useLoadData();
  const { state } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  const presentCount = state.attendance.filter((a) => a.status === "present").length;
  const absentCount = state.attendance.filter((a) => a.status === "absent").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track and manage employee attendance records</p>
        </div>
        <MarkAttendanceDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-4xl">{state.attendance.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Present</CardDescription>
            <CardTitle className="text-4xl text-green-600">{presentCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Absent</CardDescription>
            <CardTitle className="text-4xl text-red-600">{absentCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>View and filter attendance records by employee</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable />
        </CardContent>
      </Card>
    </div>
  );
}
