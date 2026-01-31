"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Users, CalendarCheck, UserCheck, UserX, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoadData, useStore } from "@/lib/store";

export default function Home() {
  const loadData = useLoadData();
  const { state } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = state.attendance.filter((a) => a.date === today);
  const presentToday = todayAttendance.filter((a) => a.status === "present").length;
  const absentToday = todayAttendance.filter((a) => a.status === "absent").length;

  const departmentCounts = state.employees.reduce(
    (acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to HRMS Lite - Your Employee Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.employees.length}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.attendance.length}</div>
            <p className="text-xs text-muted-foreground">Total records logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentToday}</div>
            <p className="text-xs text-muted-foreground">Employees marked present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentToday}</div>
            <p className="text-xs text-muted-foreground">Employees marked absent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(departmentCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No employees added yet
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(departmentCounts).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "employee" : "employees"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/employees" className="block">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Employees
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/attendance" className="block">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  Track Attendance
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
