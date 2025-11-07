"use client"

import { Users, BookOpen, Clock, Award, BarChart3, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTeacherStore } from "@/stores/teacher-store"
import { useAdminStore } from "@/stores/admin-store"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminGroupsPage() {
  const { groups, attendanceRecords, studentPoints } = useTeacherStore()
  const { students } = useAdminStore()
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const totalGroups = groups.length
  const totalStudentsInGroups = groups.reduce((sum, group) => sum + group.studentIds.length, 0)
  const uniqueSubjects = new Set(groups.map((g) => g.subject)).size

  const getGroupAttendance = (groupId: string) => {
    const groupAttendance = attendanceRecords.filter((record) => record.groupId === groupId)
    if (groupAttendance.length === 0) return 0

    const presentCount = groupAttendance.filter((record) => record.status === "present").length
    return Math.round((presentCount / groupAttendance.length) * 100)
  }

  const getGroupAveragePoints = (groupId: string) => {
    const groupPoints = studentPoints.filter((point) => point.groupId === groupId)
    if (groupPoints.length === 0) return 0
    const totalPoints = groupPoints.reduce((sum, p) => sum + p.points, 0)
    return Math.round(totalPoints / groupPoints.length)
  }

  const getGroupDetails = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return null

    const groupStudents = students.filter((s) => group.studentIds.includes(s.id))

    const groupAttendance = attendanceRecords.filter((record) => record.groupId === groupId)

    const attendanceByStudent = groupStudents.map((student) => {
      const studentAttendance = groupAttendance.filter((record) => record.studentId === student.id)
      const presentCount = studentAttendance.filter((record) => record.status === "present").length
      const attendancePercentage =
        studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 0

      const studentPts = studentPoints.filter((p) => p.studentId === student.id && p.groupId === groupId)
      const totalPoints = studentPts.reduce((sum, p) => sum + p.points, 0)

      return {
        studentId: student.id,
        studentName: student.name,
        attendance: attendancePercentage,
        points: totalPoints,
        recordCount: studentAttendance.length,
      }
    })

    return {
      group,
      students: groupStudents,
      attendance: getGroupAttendance(groupId),
      averagePoints: getGroupAveragePoints(groupId),
      attendanceByStudent,
    }
  }

  const selectedGroupData = selectedGroup && getGroupDetails(selectedGroup)

  // Prepare data for attendance chart
  const attendanceChartData = selectedGroupData
    ? selectedGroupData.attendanceByStudent.map((student) => ({
        name: student.studentName.split(" ")[0],
        attendance: student.attendance,
        points: student.points,
      }))
    : []

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups Management</h1>
          <p className="text-gray-600">Monitor all groups, attendance records, and student points</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGroups}</div>
              <p className="text-xs text-muted-foreground">Active groups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudentsInGroups}</div>
              <p className="text-xs text-muted-foreground">Across all groups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueSubjects}</div>
              <p className="text-xs text-muted-foreground">Different subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Groups</CardTitle>
            <p className="text-sm text-muted-foreground">Overview of all groups with attendance and points</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Lesson Days</TableHead>
                  <TableHead>Lesson Time</TableHead>
                  <TableHead>Avg Attendance</TableHead>
                  <TableHead>Avg Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.subject}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {group.studentIds.length}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.lessonDays.map((day) => (
                          <Badge key={day} variant="secondary" className="text-xs">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {group.lessonTime}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{
                              width: `${getGroupAttendance(group.id)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{getGroupAttendance(group.id)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{getGroupAveragePoints(group.id)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedGroup(group.id)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{selectedGroupData?.group.name} - Attendance & Points</DialogTitle>
                          </DialogHeader>

                          {selectedGroupData && (
                            <div className="space-y-6">
                              {/* Charts */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Attendance Chart */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Attendance & Points by Student</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <ChartContainer
                                      config={{
                                        attendance: {
                                          label: "Attendance %",
                                          color: "hsl(var(--chart-1))",
                                        },
                                        points: {
                                          label: "Points",
                                          color: "hsl(var(--chart-2))",
                                        },
                                      }}
                                      className="h-[300px]"
                                    >
                                      <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={attendanceChartData}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="name" />
                                          <YAxis yAxisId="left" />
                                          <YAxis yAxisId="right" orientation="right" />
                                          <ChartTooltip content={<ChartTooltipContent />} />
                                          <Legend />
                                          <Bar
                                            yAxisId="left"
                                            dataKey="attendance"
                                            fill="var(--color-attendance)"
                                            name="Attendance %"
                                          />
                                          <Bar
                                            yAxisId="right"
                                            dataKey="points"
                                            fill="var(--color-points)"
                                            name="Points"
                                          />
                                        </BarChart>
                                      </ResponsiveContainer>
                                    </ChartContainer>
                                  </CardContent>
                                </Card>

                                {/* Group Stats */}
                                <div className="space-y-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Group Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Group Name:</span>
                                        <span className="font-medium">{selectedGroupData.group.name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Subject:</span>
                                        <span className="font-medium">{selectedGroupData.group.subject}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Total Students:</span>
                                        <span className="font-medium">{selectedGroupData.students.length}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Avg Attendance:</span>
                                        <span className="font-medium text-green-600">
                                          {selectedGroupData.attendance}%
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Avg Points:</span>
                                        <span className="font-medium text-blue-600">
                                          {selectedGroupData.averagePoints}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>

                              {/* Detailed Table */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">Student Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Attendance %</TableHead>
                                        <TableHead>Total Points</TableHead>
                                        <TableHead>Records</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedGroupData.attendanceByStudent.map((record) => (
                                        <TableRow key={record.studentId}>
                                          <TableCell className="font-medium">{record.studentName}</TableCell>
                                          <TableCell>
                                            <Badge variant={record.attendance >= 80 ? "default" : "secondary"}>
                                              {record.attendance}%
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-1">
                                              <Award className="w-4 h-4 text-yellow-500" />
                                              {record.points}
                                            </div>
                                          </TableCell>
                                          <TableCell>{record.recordCount}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {groups.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No groups found yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
