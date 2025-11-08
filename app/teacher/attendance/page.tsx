"use client"

import { useState, useEffect, useMemo } from "react"
import { CheckCircle, XCircle, Clock, Search, TrendingUp, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTeacherStore } from "@/stores/teacher-store"
import { useAdminStore } from "@/stores/admin-store"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Badge } from "@/components/ui/badge"

export default function TeacherAttendancePage() {
  const { groups, lessons, attendanceRecords, addAttendanceRecord, updateAttendanceRecord } = useTeacherStore()
  const { students } = useAdminStore()

  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedLesson, setSelectedLesson] = useState("")
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, "present" | "absent" | "late">>({})
  const [searchTerm, setSearchTerm] = useState("")

  const availableLessons = lessons.filter((lesson) => lesson.groupId === selectedGroup)

  const studentsInSelectedGroup = useMemo(() => {
    if (!selectedGroup) return []
    const group = groups.find((g) => g.id === selectedGroup)
    if (!group) return []
    return students.filter((s) => s.groupId === selectedGroup)
  }, [selectedGroup, students, groups])

  useEffect(() => {
    if (selectedLesson && attendanceDate) {
      const existingRecords = attendanceRecords.filter(
        (rec) => rec.lessonId === selectedLesson && rec.date === attendanceDate,
      )
      const initialAttendance: Record<string, "present" | "absent" | "late"> = {}
      studentsInSelectedGroup.forEach((student) => {
        const record = existingRecords.find((rec) => rec.studentId === student.id)
        initialAttendance[student.id] = record ? record.status : "absent"
      })
      setCurrentAttendance(initialAttendance)
    } else {
      setCurrentAttendance({})
    }
  }, [selectedLesson, attendanceDate, attendanceRecords, studentsInSelectedGroup])

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setCurrentAttendance((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSubmitAttendance = () => {
    if (!selectedLesson || !attendanceDate) {
      alert("Please select a lesson and date.")
      return
    }

    studentsInSelectedGroup.forEach((student) => {
      const status = currentAttendance[student.id] || "absent"
      const existingRecord = attendanceRecords.find(
        (rec) => rec.lessonId === selectedLesson && rec.date === attendanceDate && rec.studentId === student.id,
      )

      if (existingRecord) {
        updateAttendanceRecord(existingRecord.id, { status })
      } else {
        addAttendanceRecord({
          lessonId: selectedLesson,
          groupId: selectedGroup,
          studentId: student.id,
          date: attendanceDate,
          status,
        })
      }
    })
    alert("Attendance saved successfully!")
  }

  const filteredStudents = studentsInSelectedGroup.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate attendance statistics
  const calculateStats = () => {
    if (!studentsInSelectedGroup.length) return { present: 0, absent: 0, late: 0, rate: 0 }

    const present = Object.values(currentAttendance).filter((s) => s === "present").length
    const absent = Object.values(currentAttendance).filter((s) => s === "absent").length
    const late = Object.values(currentAttendance).filter((s) => s === "late").length
    const rate = studentsInSelectedGroup.length > 0 ? Math.round((present / studentsInSelectedGroup.length) * 100) : 0

    return { present, absent, late, rate }
  }

  const stats = calculateStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-300"
      case "absent":
        return "bg-red-100 text-red-800 border-red-300"
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Modern attendance tracking with visual insights</p>
        </div>

        {/* Filters */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-indigo-600" />
              Select Lesson for Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="group">Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} ({group.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lesson">Lesson</Label>
              <Select value={selectedLesson} onValueChange={setSelectedLesson} disabled={!selectedGroup}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select a lesson" />
                </SelectTrigger>
                <SelectContent>
                  {availableLessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.topic} ({lesson.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="border-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics - Only show when lesson is selected */}
        {selectedLesson && studentsInSelectedGroup.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-indigo-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-3xl font-bold text-indigo-600">{stats.rate}%</p>
                  </div>
                  <TrendingUp className="size-10 text-indigo-600 opacity-20" />
                </div>
                <Progress value={stats.rate} className="mt-3" />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                  </div>
                  <CheckCircle className="size-10 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Late</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
                  </div>
                  <Clock className="size-10 text-yellow-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                  </div>
                  <XCircle className="size-10 text-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Table */}
        {selectedLesson && attendanceDate && studentsInSelectedGroup.length > 0 ? (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5 text-indigo-600" />
                    Mark Attendance
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lessons.find((l) => l.id === selectedLesson)?.topic} - {attendanceDate}
                  </p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 text-base px-4 py-2">
                  {studentsInSelectedGroup.length} Students
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2"
                />
              </div>
              <div className="rounded-lg border-2">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Student Name</TableHead>
                      <TableHead className="text-center font-semibold">Current Status</TableHead>
                      <TableHead className="text-right font-semibold">Mark Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${getStatusColor(currentAttendance[student.id] || "absent")} border`}>
                            {currentAttendance[student.id] || "Absent"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={currentAttendance[student.id] === "present" ? "default" : "outline"}
                              onClick={() => handleAttendanceChange(student.id, "present")}
                              className={
                                currentAttendance[student.id] === "present" ? "bg-green-600 hover:bg-green-700" : ""
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={currentAttendance[student.id] === "late" ? "default" : "outline"}
                              onClick={() => handleAttendanceChange(student.id, "late")}
                              className={
                                currentAttendance[student.id] === "late" ? "bg-yellow-600 hover:bg-yellow-700" : ""
                              }
                            >
                              <Clock className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={currentAttendance[student.id] === "absent" ? "default" : "outline"}
                              onClick={() => handleAttendanceChange(student.id, "absent")}
                              className={
                                currentAttendance[student.id] === "absent" ? "bg-red-600 hover:bg-red-700" : ""
                              }
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">Click the buttons to mark each student's attendance status</p>
                <Button
                  onClick={handleSubmitAttendance}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="text-center py-12">
              <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Please select a group and lesson to start taking attendance</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherLayout>
  )
}
