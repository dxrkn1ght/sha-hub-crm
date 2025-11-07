"use client";

import { useCallback, type ReactNode } from "react";
import { LayoutDashboard, ShoppingCart, Award, Users } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useStudentStore } from "@/stores/student-store";
import { UnifiedLayout } from "./unified-layout";

interface StudentLayoutProps {
  children: ReactNode;
}

const studentNavigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "Shop", href: "/student/shop", icon: ShoppingCart },
  { name: "Achievements", href: "/student/achievements", icon: Award },
  { name: "My Groups", href: "/student/groups", icon: Users },
];

export function StudentLayout({ children }: StudentLayoutProps) {
  const { user } = useAuthStore();
  const { setStudentId } = useStudentStore();

  const handleStudentInit = useCallback(() => {
    if (user && user.role === "student") {
      setStudentId(user.id);
    }
  }, [user, setStudentId]);

  return (
    <UnifiedLayout navigation={studentNavigation} onInit={handleStudentInit}>
      {children}
    </UnifiedLayout>
  );
}
