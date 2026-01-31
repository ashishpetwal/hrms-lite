"use client";

import { useState } from "react";
import { Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import { useStore } from "@/lib/store";
import { Employee } from "@/lib/types";

export function EmployeeTable() {
  const { state } = useStore();
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  if (state.isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (state.employees.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8 text-muted-foreground" />}
        title="No employees yet"
        description="Get started by adding your first employee to the system."
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-mono text-sm">{employee.id}</TableCell>
              <TableCell className="font-medium">{employee.fullName}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{employee.department}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteEmployee(employee)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteEmployeeDialog
        employee={deleteEmployee}
        open={!!deleteEmployee}
        onOpenChange={(open) => !open && setDeleteEmployee(null)}
      />
    </>
  );
}
