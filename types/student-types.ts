import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

// * Interfaces for student role
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  teacher: string;
  fee: number;
  joinDate: string;
  status: "active" | "inactive";
  paymentStatus: "paid" | "pending" | "overdue";
}

export interface StudentActivity {
  id: string;
  type: "earned" | "spent";
  message: string;
  pointsChange: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >; // Lucide icon name or path to image
  earnedDate: string | null;
}
