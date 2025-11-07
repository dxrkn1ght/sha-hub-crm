"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import { UnifiedLayout } from "./unified-layout";

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Reports", href: "/admin/salaries", icon: BarChart3 },
  { name: "Products", href: "/admin/shop", icon: ShoppingCart },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  return <UnifiedLayout navigation={adminNavigation}>{children}</UnifiedLayout>;
}
