"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useLoadData, useStore } from "@/lib/store";

export default function EmployeesPage() {
  const loadData = useLoadData();
  const { state } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your organization&apos;s employee records</p>
        </div>
        <AddEmployeeDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {state.employees.length} {state.employees.length === 1 ? "employee" : "employees"} in the
            system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeTable />
        </CardContent>
      </Card>
    </div>
  );
}
