export interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: "present" | "absent";
}

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
