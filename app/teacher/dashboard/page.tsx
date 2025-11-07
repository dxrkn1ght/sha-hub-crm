"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CalendarCheck, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTeacherStore } from "@/stores/teacher-store";
import { TeacherLayout } from "@/components/layouts/teacher-layout";

export default function TeacherDashboard() {
  const { groups, attendanceRecords, teacherActivities } = useTeacherStore();

  const totalStudents = groups.reduce(
    (sum, group) => sum + group.studentIds.length,
    0
  );
  const activeGroups = groups.filter((g) => g.active).length;
  const avgAttendance =
    attendanceRecords.length > 0
      ? Math.round(
          (attendanceRecords.filter((r) => r.status === "present").length /
            attendanceRecords.length) *
            100
        )
      : 0;

  // Mock data for charts
  const groupPerformanceData = groups.map((group) => ({
    name: group.name,
    score: Math.floor(Math.random() * 20) + 70, // Random score between 70-90
    attendance: Math.floor(Math.random() * 15) + 75, // Random attendance between 75-90
  }));

  const monthlyAttendanceTrend = [
    { month: "Jan", attendance: 88 },
    { month: "Feb", attendance: 85 },
    { month: "Mar", attendance: 92 },
    { month: "Apr", attendance: 89 },
    { month: "May", attendance: 95 },
    { month: "Jun", attendance: 98 },
  ];

  const studentPerformanceBySubject = [
    { name: "Alice Johnson", math: 85, physics: 90, chemistry: 88 },
    { name: "Bob Smith", math: 78, physics: 85, chemistry: 82 },
    { name: "Carol Davis", math: 95, physics: 92, chemistry: 93 },
    { name: "David Wilson", math: 80, physics: 82, chemistry: 85 },
    { name: "Eva Brown", math: 90, physics: 88, chemistry: 91 },
  ];

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across {groups.length} groups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Groups
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGroups}</div>
              <p className="text-xs text-muted-foreground">With lessons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Attendance
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAttendance}%</div>
              <p className="text-xs text-muted-foreground">
                +3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">81%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Group Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Group Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Performance metrics by group
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Score",
                    color: "hsl(var(--chart-1))",
                  },
                  attendance: {
                    label: "Attendance",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="var(--color-score)" />
                    <Bar dataKey="attendance" fill="var(--color-attendance)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Monthly Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trend</CardTitle>
              <p className="text-sm text-muted-foreground">
                Attendance trend over the last 6 months
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  attendance: {
                    label: "Attendance",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAttendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="var(--color-attendance)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-attendance)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Student Performance & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Performance by Subject */}
          <Card>
            <CardHeader>
              <CardTitle>Student Performance by Subject</CardTitle>
              <p className="text-sm text-muted-foreground">
                Individual student scores across subjects
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  math: { label: "Math", color: "hsl(var(--chart-1))" },
                  physics: { label: "Physics", color: "hsl(var(--chart-2))" },
                  chemistry: {
                    label: "Chemistry",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentPerformanceBySubject}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="math" fill="var(--color-math)" />
                    <Bar dataKey="physics" fill="var(--color-physics)" />
                    <Bar dataKey="chemistry" fill="var(--color-chemistry)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest activities in your groups
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherActivities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "lesson"
                          ? "bg-green-500"
                          : activity.type === "homework"
                          ? "bg-blue-500"
                          : activity.type === "attendance"
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
