"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { RecentActivity, RevenueChart, StatCards, TeacherPerformance, UserDistribution } from "./fragments"
import { Card, CardContent } from "@/components/ui/card"
import { useTeacherStore } from "@/stores/teacher-store"
import { useAdminStore } from "@/stores/admin-store"
import { Users, BookOpen, TrendingUp, Calendar } from "lucide-react"

export default function AdminDashboard() {
  console.log("[v0] Admin Dashboard rendering")

  const { groups, lessons, attendanceRecords } = useTeacherStore()
  const { students } = useAdminStore()

  const totalGroups = groups.length
  const activeGroups = groups.filter((g) => g.active).length
  const studentsInGroups = groups.reduce((sum, g) => sum + g.studentIds.length, 0)
  const recentLessons = lessons.filter((l) => {
    const lessonDate = new Date(l.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return lessonDate >= weekAgo
  }).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Welcome to Shon's-HUB Dashboard</h1>
          <p className="text-indigo-100 mt-2">Here's what's happening with your education center today.</p>
        </div>

        {/* Stat Cards */}
        <StatCards />

        {/* Quick Stats - Groups & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Groups</p>
                  <p className="text-2xl font-bold">{totalGroups}</p>
                  <p className="text-xs text-gray-500 mt-1">{activeGroups} active</p>
                </div>
                <BookOpen className="size-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Students in Groups</p>
                  <p className="text-2xl font-bold">{studentsInGroups}</p>
                  <p className="text-xs text-gray-500 mt-1">of {students.length} total</p>
                </div>
                <Users className="size-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lessons This Week</p>
                  <p className="text-2xl font-bold">{recentLessons}</p>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <Calendar className="size-10 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold">
                    {attendanceRecords.length > 0
                      ? Math.round(
                          (attendanceRecords.filter((a) => a.status === "present").length / attendanceRecords.length) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Overall average</p>
                </div>
                <TrendingUp className="size-10 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

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
  )
}
