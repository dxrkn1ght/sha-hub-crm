"use client"

import type { ReactNode } from "react"
import { LayoutDashboard, Users, BookOpen, CalendarCheck, Award, GraduationCap } from "lucide-react"
import { UnifiedLayout } from "./unified-layout"

interface TeacherLayoutProps {
  children: ReactNode
}

const teacherNavigation = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "My Groups", href: "/teacher/groups", icon: Users },
  { name: "Students", href: "/teacher/students", icon: GraduationCap },
  { name: "Lessons", href: "/teacher/lessons", icon: BookOpen },
  { name: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
  { name: "Points", href: "/teacher/points", icon: Award },
]

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return <UnifiedLayout navigation={teacherNavigation}>{children}</UnifiedLayout>
}
