// * Interfaces for all roles
export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  method: "cash" | "card" | "bank";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface Activity {
  id: string;
  type: "registration" | "payment" | "product" | "teacher";
  message: string;
  timestamp: string;
}
