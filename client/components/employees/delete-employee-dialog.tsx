"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { Employee } from "@/lib/types";

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteEmployeeDialog({ employee, open, onOpenChange }: DeleteEmployeeDialogProps) {
  const { deleteEmployee } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!employee) return;
    setIsDeleting(true);
    setError(null);
    
    const result = await deleteEmployee(employee.id);
    
    setIsDeleting(false);
    
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.error || "Failed to delete employee");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{employee?.fullName}</strong>? This action cannot
            be undone and will also remove all attendance records for this employee.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
