import { Employee, AttendanceRecord } from "./types";

// API base URL - update this for production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: {
    status_code: number;
    message: string;
    details: Record<string, unknown>;
  };
}

interface EmployeeApiData {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
  updated_at?: string;
}

interface AttendanceApiData {
  id: number;
  employee_name: string;
  employee_code: string;
  employee_department: string;
  date: string;
  status: "present" | "absent";
  created_at: string;
}

// Transform API employee data to frontend format
function transformEmployee(data: EmployeeApiData): Employee {
  return {
    id: data.employee_id,
    fullName: data.full_name,
    email: data.email,
    department: data.department,
  };
}

// Transform API attendance data to frontend format
function transformAttendance(data: AttendanceApiData): AttendanceRecord {
  return {
    id: `${data.id}`,
    employeeId: data.employee_code,
    date: data.date,
    status: data.status,
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            status_code: response.status,
            message: data.message || "An error occurred",
            details: data,
          },
        };
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          status_code: 500,
          message: error instanceof Error ? error.message : "Network error",
          details: {},
        },
      };
    }
  }

  // Employee APIs
  async getEmployees(): Promise<{ success: boolean; data?: Employee[]; error?: string }> {
    const response = await this.request<EmployeeApiData[]>("/employees/");
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(transformEmployee),
      };
    }
    
    return {
      success: false,
      error: response.error?.message || "Failed to fetch employees",
    };
  }

  async createEmployee(employee: Omit<Employee, "id"> & { id: string }): Promise<{ success: boolean; data?: Employee; error?: string }> {
    const response = await this.request<EmployeeApiData>("/employees/", {
      method: "POST",
      body: JSON.stringify({
        employee_id: employee.id,
        full_name: employee.fullName,
        email: employee.email,
        department: employee.department,
      }),
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: transformEmployee(response.data),
      };
    }
    
    // Extract specific error message from validation errors
    let errorMessage = response.error?.message || "Failed to create employee";
    if (response.error?.details) {
      const details = response.error.details as Record<string, string[]>;
      const firstError = Object.values(details).flat()[0];
      if (firstError) errorMessage = firstError;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }

  async deleteEmployee(employeeId: string): Promise<{ success: boolean; error?: string }> {
    // First, find the employee by employee_id to get the internal id
    const employeesResponse = await this.request<EmployeeApiData[]>("/employees/");
    
    if (!employeesResponse.success || !employeesResponse.data) {
      return {
        success: false,
        error: "Failed to find employee",
      };
    }
    
    const employee = employeesResponse.data.find(e => e.employee_id === employeeId);
    
    if (!employee) {
      return {
        success: false,
        error: "Employee not found",
      };
    }
    
    const response = await this.request(`/employees/${employee.id}/`, {
      method: "DELETE",
    });
    
    if (response.success) {
      return { success: true };
    }
    
    return {
      success: false,
      error: response.error?.message || "Failed to delete employee",
    };
  }

  // Attendance APIs
  async getAttendance(): Promise<{ success: boolean; data?: AttendanceRecord[]; error?: string }> {
    const response = await this.request<AttendanceApiData[]>("/attendance/");
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.map(transformAttendance),
      };
    }
    
    return {
      success: false,
      error: response.error?.message || "Failed to fetch attendance",
    };
  }

  async markAttendance(
    employeeId: string,
    date: string,
    status: "present" | "absent"
  ): Promise<{ success: boolean; data?: AttendanceRecord; error?: string }> {
    // First, find the employee by employee_id to get the internal id
    const employeesResponse = await this.request<EmployeeApiData[]>("/employees/");
    
    if (!employeesResponse.success || !employeesResponse.data) {
      return {
        success: false,
        error: "Failed to find employee",
      };
    }
    
    const employee = employeesResponse.data.find(e => e.employee_id === employeeId);
    
    if (!employee) {
      return {
        success: false,
        error: "Employee not found",
      };
    }
    
    // Check if attendance already exists for this employee and date
    const attendanceResponse = await this.request<AttendanceApiData[]>(
      `/attendance/?employee_id=${employee.id}&date=${date}`
    );
    
    if (attendanceResponse.success && attendanceResponse.data && attendanceResponse.data.length > 0) {
      // Update existing attendance
      const existingAttendance = attendanceResponse.data[0];
      const updateResponse = await this.request<AttendanceApiData>(`/attendance/${existingAttendance.id}/`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      
      if (updateResponse.success && updateResponse.data) {
        return {
          success: true,
          data: transformAttendance(updateResponse.data),
        };
      }
      
      return {
        success: false,
        error: updateResponse.error?.message || "Failed to update attendance",
      };
    }
    
    // Create new attendance
    const response = await this.request<AttendanceApiData>("/attendance/", {
      method: "POST",
      body: JSON.stringify({
        employee_id: employee.id,
        date,
        status,
      }),
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: transformAttendance(response.data),
      };
    }
    
    let errorMessage = response.error?.message || "Failed to mark attendance";
    if (response.error?.details) {
      const details = response.error.details as Record<string, string[]>;
      const firstError = Object.values(details).flat()[0];
      if (firstError) errorMessage = firstError;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export const api = new ApiClient(API_BASE_URL);
