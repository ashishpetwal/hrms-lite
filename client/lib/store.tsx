"use client";

import { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import { Employee, AttendanceRecord } from "./types";
import { api } from "./api";

interface State {
  employees: Employee[];
  attendance: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_EMPLOYEE"; payload: Employee }
  | { type: "DELETE_EMPLOYEE"; payload: string }
  | { type: "ADD_ATTENDANCE"; payload: AttendanceRecord }
  | { type: "SET_EMPLOYEES"; payload: Employee[] }
  | { type: "SET_ATTENDANCE"; payload: AttendanceRecord[] };

const initialState: State = {
  employees: [],
  attendance: [],
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_EMPLOYEE":
      return { ...state, employees: [...state.employees, action.payload] };
    case "DELETE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.filter((e) => e.id !== action.payload),
        attendance: state.attendance.filter((a) => a.employeeId !== action.payload),
      };
    case "ADD_ATTENDANCE":
      const existingIndex = state.attendance.findIndex(
        (a) => a.employeeId === action.payload.employeeId && a.date === action.payload.date
      );
      if (existingIndex >= 0) {
        const updated = [...state.attendance];
        updated[existingIndex] = action.payload;
        return { ...state, attendance: updated };
      }
      return { ...state, attendance: [...state.attendance, action.payload] };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };
    case "SET_ATTENDANCE":
      return { ...state, attendance: action.payload };
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addEmployee: (employee: Omit<Employee, "id"> & { id: string }) => Promise<{ success: boolean; error?: string }>;
  deleteEmployee: (id: string) => Promise<{ success: boolean; error?: string }>;
  markAttendance: (employeeId: string, date: string, status: "present" | "absent") => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const [employeesResult, attendanceResult] = await Promise.all([
        api.getEmployees(),
        api.getAttendance(),
      ]);

      if (employeesResult.success && employeesResult.data) {
        dispatch({ type: "SET_EMPLOYEES", payload: employeesResult.data });
      } else {
        dispatch({ type: "SET_ERROR", payload: employeesResult.error || "Failed to load employees" });
      }

      if (attendanceResult.success && attendanceResult.data) {
        dispatch({ type: "SET_ATTENDANCE", payload: attendanceResult.data });
      } else if (!employeesResult.error) {
        dispatch({ type: "SET_ERROR", payload: attendanceResult.error || "Failed to load attendance" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load data from server" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const addEmployee = useCallback(async (employee: Omit<Employee, "id"> & { id: string }) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const result = await api.createEmployee(employee);
      
      if (result.success && result.data) {
        dispatch({ type: "ADD_EMPLOYEE", payload: result.data });
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: "Failed to create employee" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const result = await api.deleteEmployee(id);
      
      if (result.success) {
        dispatch({ type: "DELETE_EMPLOYEE", payload: id });
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: "Failed to delete employee" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const markAttendance = useCallback(async (
    employeeId: string,
    date: string,
    status: "present" | "absent"
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const result = await api.markAttendance(employeeId, date, status);
      
      if (result.success && result.data) {
        dispatch({ type: "ADD_ATTENDANCE", payload: result.data });
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: "Failed to mark attendance" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch, addEmployee, deleteEmployee, markAttendance, refreshData }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}

export function useLoadData() {
  const { refreshData } = useStore();
  return refreshData;
}

