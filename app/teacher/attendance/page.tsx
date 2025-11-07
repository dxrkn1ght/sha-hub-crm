"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTeacherStore } from "@/stores/teacher-store";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";
import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { Badge } from "@/components/ui/badge";

export default function TeacherAttendancePage() {
  const {
    groups,
    lessons,
    attendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
  } = useTeacherStore();
  const { students } = // useAdminStore (removed) // please use API fetch or server components();

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentAttendance, setCurrentAttendance] = useState<
    Record<string, "present" | "absent" | "late">
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  const availableLessons = lessons.filter(
    (lesson) => lesson.groupId === selectedGroup
  );
  const studentsInSelectedGroup = useMemo(() => {
    return selectedGroup
      ? students.filter((s) =>
          groups.find((g) => g.id === selectedGroup)?.studentIds.includes(s.id)
        )
      : [];
  }, [selectedGroup, students, groups]);

  useEffect(() => {
    if (selectedLesson && attendanceDate) {
      const existingRecords = attendanceRecords.filter(
        (rec) => rec.lessonId === selectedLesson && rec.date === attendanceDate
      );
      const initialAttendance: Record<string, "present" | "absent" | "late"> =
        {};
      studentsInSelectedGroup.forEach((student) => {
        const record = existingRecords.find(
          (rec) => rec.studentId === student.id
        );
        initialAttendance[student.id] = record ? record.status : "absent"; // Default to absent if no record
      });
      setCurrentAttendance(initialAttendance);
    } else {
      setCurrentAttendance({});
    }
  }, [
    selectedLesson,
    attendanceDate,
    attendanceRecords,
    studentsInSelectedGroup,
  ]);

  const handleAttendanceChange = (
    studentId: string,
    status: "present" | "absent" | "late"
  ) => {
    setCurrentAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitAttendance = () => {
    if (!selectedLesson || !attendanceDate) {
      alert("Please select a lesson and date.");
      return;
    }

    studentsInSelectedGroup.forEach((student) => {
      const status = currentAttendance[student.id] || "absent";
      const existingRecord = attendanceRecords.find(
        (rec) =>
          rec.lessonId === selectedLesson &&
          rec.date === attendanceDate &&
          rec.studentId === student.id
      );

      if (existingRecord) {
        updateAttendanceRecord(existingRecord.id, { status });
      } else {
        addAttendanceRecord({
          lessonId: selectedLesson,
          groupId: selectedGroup,
          studentId: student.id,
          date: attendanceDate,
          status,
        });
      }
    });
    alert("Attendance saved successfully!");
  };

  const filteredStudents = studentsInSelectedGroup.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600">Take and manage student attendance</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Select Lesson for Attendance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="group">Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
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
              <Select
                value={selectedLesson}
                onValueChange={setSelectedLesson}
                disabled={!selectedGroup}
              >
                <SelectTrigger>
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
              />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        {selectedLesson &&
        attendanceDate &&
        studentsInSelectedGroup.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>
                Attendance for{" "}
                {lessons.find((l) => l.id === selectedLesson)?.topic}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Date: {attendanceDate}
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={getStatusColor(
                            currentAttendance[student.id] || "absent"
                          )}
                        >
                          {currentAttendance[student.id] || "Absent"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAttendanceChange(student.id, "present")
                            }
                            disabled={
                              currentAttendance[student.id] === "present"
                            }
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAttendanceChange(student.id, "absent")
                            }
                            disabled={
                              currentAttendance[student.id] === "absent"
                            }
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAttendanceChange(student.id, "late")
                            }
                            disabled={currentAttendance[student.id] === "late"}
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 text-right">
                <Button onClick={handleSubmitAttendance}>
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Please select a group and lesson to take attendance.
            </p>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
