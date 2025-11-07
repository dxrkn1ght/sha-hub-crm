"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";
import {
  RecentActivity,
  RevenueChart,
  StatCards,
  TeacherPerformance,
  UserDistribution,
} from "./fragments";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stat Cards */}
        <StatCards />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <RevenueChart />

          {/* User Distribution */}
          <UserDistribution />
        </div>

        {/* Teacher Performance & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teacher Performance */}
          <TeacherPerformance />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  );
}
