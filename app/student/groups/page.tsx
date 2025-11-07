"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, Clock, Mail, Phone, Award } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { useTeacherStore } from "@/stores/teacher-store"
import { useAdminStore } from "@/stores/admin-store"
import { StudentLayout } from "@/components/layouts/student-layout"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function StudentGroupsPage() {
  const { user } = useAuthStore()
  const { groups, lessons, attendanceRecords, studentPoints } = useTeacherStore()
  const { teachers } = useAdminStore()

  const studentGroups = groups.filter((group) => group.studentIds.includes(user?.id || ""))

  const getTeacherDetails = (subject: string) => {
    const teacher = teachers.find((t) => t.subject === subject)
    return teacher
      ? { name: teacher.name, email: teacher.email, phone: teacher.phone }
      : { name: "N/A", email: "N/A", phone: "N/A" }
  }

  const getGroupAttendance = (groupId: string) => {
    const groupAttendance = attendanceRecords.filter(
      (record) => record.groupId === groupId && record.studentId === user?.id,
    )
    if (groupAttendance.length === 0) return 0

    const presentCount = groupAttendance.filter((record) => record.status === "present").length
    return Math.round((presentCount / groupAttendance.length) * 100)
  }

  const getGroupPoints = (groupId: string) => {
    const groupPts = studentPoints.filter((point) => point.groupId === groupId && point.studentId === user?.id)
    return groupPts.reduce((sum, p) => sum + p.points, 0)
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
          <p className="text-gray-600">Details about your assigned groups and classes</p>
        </div>

        {studentGroups.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studentGroups.map((group) => {
              const teacherDetails = getTeacherDetails(group.subject)
              const groupLessons = lessons.filter((l) => l.groupId === group.id)
              const upcomingLessons = groupLessons
                .filter((l) => new Date(l.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 3) // Show next 3 upcoming lessons

              const attendance = getGroupAttendance(group.id)
              const points = getGroupPoints(group.id)

              return (
                <Card key={group.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {group.name} <span className="text-base text-gray-600 font-normal">({group.subject})</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Schedule: {group.lessonDays.join(", ")} at {group.lessonTime}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-muted-foreground">Attendance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={attendance} className="h-2 flex-1" />
                          <span className="text-sm font-bold text-blue-600">{attendance}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs font-medium text-muted-foreground">Your Points</span>
                        </div>
                        <p className="text-sm font-bold text-yellow-500">{points} pts</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Teacher Information</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {teacherDetails.name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {teacherDetails.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {teacherDetails.phone}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Group Details</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Total Students: {group.studentIds.length}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Lesson Time: {group.lessonTime}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Lesson Days:{" "}
                        <div className="flex flex-wrap gap-1">
                          {group.lessonDays.map((day) => (
                            <Badge key={day} variant="secondary">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </p>
                    </div>

                    {upcomingLessons.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Upcoming Lessons</h3>
                        <ul className="space-y-2">
                          {upcomingLessons.map((lesson) => (
                            <li key={lesson.id} className="text-sm text-gray-600 flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              {lesson.topic} on {lesson.date}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">You are not assigned to any groups yet.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
