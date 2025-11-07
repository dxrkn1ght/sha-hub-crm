"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  Users,
  CalendarCheck,
  ShoppingCart,
  BookOpen,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAuthStore } from "@/stores/auth-store";
import { useStudentStore } from "@/stores/student-store";
import { useTeacherStore } from "@/stores/teacher-store";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";
import { StudentLayout } from "@/components/layouts/student-layout";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { totalPoints, studentActivities } = useStudentStore();
  const { groups, lessons, attendanceRecords } = useTeacherStore();
  const { teachers } = // useAdminStore (removed) // please use API fetch or server components.getState(); // Declare // useAdminStore (removed) // please use API fetch or server components

  const studentGroups = groups.filter((group) =>
    group.studentIds.includes(user?.id || "")
  );
  const studentAttendance = attendanceRecords.filter(
    (record) => record.studentId === user?.id
  );
  const totalAttendanceCount = studentAttendance.length;
  const presentAttendanceCount = studentAttendance.filter(
    (record) => record.status === "present"
  ).length;
  const monthlyAttendancePercentage =
    totalAttendanceCount > 0
      ? Math.round((presentAttendanceCount / totalAttendanceCount) * 100)
      : 0;

  // Mock data for charts
  const monthlyProgressData = [
    { month: "Jan", points: 100, attendance: 85 },
    { month: "Feb", points: 120, attendance: 88 },
    { month: "Mar", points: 150, attendance: 92 },
    { month: "Apr", points: 180, attendance: 90 },
    { month: "May", points: 220, attendance: 95 },
    { month: "Jun", points: 280, attendance: 98 },
  ];

  const subjectPerformanceData = [
    { subject: "Math", score: 85, target: 90 },
    { subject: "Physics", score: 90, target: 85 },
    { subject: "Chemistry", score: 82, target: 88 },
    { subject: "English", score: 88, target: 85 },
  ];

  const getGroupDetails = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return null;

    const totalStudentsInGroup = group.studentIds.length;
    const groupLessons = lessons.filter((l) => l.groupId === group.id);
    const nextLesson = groupLessons
      .filter((l) => new Date(l.date) >= new Date())
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];

    // Mock average score and rank
    const avgScore = Math.floor(Math.random() * 10) + 80; // 80-90
    const groupRank = Math.floor(Math.random() * 5) + 1; // 1-5

    return {
      groupName: group.name,
      teacher: teachers.find((t) => t.subject === group.subject)?.name || "N/A", // Use declared // useAdminStore (removed) // please use API fetch or server components
      schedule: `${group.lessonDays.join(", ")} ${group.lessonTime}`,
      room: "101", // Mock room
      totalStudents: totalStudentsInGroup,
      averageScore: avgScore,
      groupRank: groupRank,
      nextLesson: nextLesson
        ? `${nextLesson.date} ${group.lessonTime}`
        : "No upcoming lessons",
    };
  };

  const primaryGroupDetails =
    studentGroups.length > 0 ? getGroupDetails(studentGroups[0].id) : null;

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Welcome back, {user?.name}!
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Here's your progress overview
              </p>
              <div className="text-2xl font-bold mt-2">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Group</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {primaryGroupDetails?.groupName || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {primaryGroupDetails?.totalStudents} students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyAttendancePercentage}%
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <p className="text-sm text-muted-foreground">
                Points earned and attendance over time
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  points: {
                    label: "Points",
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
                  <LineChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="points"
                      stroke="var(--color-points)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-points)" }}
                    />
                    <Line
                      yAxisId="right"
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

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your scores vs targets by subject
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: { label: "Score", color: "hsl(var(--chart-1))" },
                  target: { label: "Target", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="var(--color-score)" />
                    <Bar dataKey="target" fill="var(--color-target)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your latest points activities
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentActivities.slice(0, 4).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          activity.type === "earned"
                            ? "bg-green-500"
                            : "bg-red-500"
                        )}
                      />
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          activity.type === "earned"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {activity.pointsChange > 0
                          ? `+${activity.pointsChange}`
                          : activity.pointsChange}{" "}
                        pts
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Common actions for students
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/student/shop">
                  <Card className="flex flex-col items-center justify-center p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm font-medium">Visit Shop</p>
                    <p className="text-xs text-gray-500">Spend your points</p>
                  </Card>
                </Link>
                <Link href="/student/groups">
                  <Card className="flex flex-col items-center justify-center p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <BookOpen className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-sm font-medium">View Schedule</p>
                    <p className="text-xs text-gray-500">Check your classes</p>
                  </Card>
                </Link>
                <Link href="/student/achievements">
                  <Card className="flex flex-col items-center justify-center p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <Award className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-sm font-medium">My Achievements</p>
                    <p className="text-xs text-gray-500">View your badges</p>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Group Information */}
        {primaryGroupDetails && (
          <Card>
            <CardHeader>
              <CardTitle>My Group Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Details about your current group
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Group Details
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Group:</span>{" "}
                  {primaryGroupDetails.groupName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Teacher:</span>{" "}
                  {primaryGroupDetails.teacher}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Schedule:</span>{" "}
                  {primaryGroupDetails.schedule}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Room:</span>{" "}
                  {primaryGroupDetails.room}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Group Statistics
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Students:</span>{" "}
                  {primaryGroupDetails.totalStudents}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Average Score:</span>{" "}
                  {primaryGroupDetails.averageScore}%
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Group Rank:</span>{" "}
                  {primaryGroupDetails.groupRank}nd
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Next Lesson:</span>{" "}
                  {primaryGroupDetails.nextLesson}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}
