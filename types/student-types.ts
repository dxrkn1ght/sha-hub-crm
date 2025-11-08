import type { ForwardRefExoticComponent, RefAttributes } from "react"
import type { LucideCrop as LucideProps } from "lucide-react"

// * Interfaces for student role
export interface Student {
  id: string
  name: string
  email: string
  phone: string
  course: string
  fee: number
  joinDate: string
  status: "active" | "inactive"
  paymentStatus: "paid" | "pending" | "overdue"
  groupId?: string // Optional - students can be assigned to a group
  username?: string
  password?: string
}

export interface StudentActivity {
  id: string
  type: "earned" | "spent"
  message: string
  pointsChange: number
  timestamp: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  earnedDate: string | null
}

export interface StudentMark {
  id: string
  studentId: string
  groupId: string
  lessonId: string
  mark: number // 1-10
  date: string
  comment?: string
}
