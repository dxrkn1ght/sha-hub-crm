"use client";

import { useState } from "react";
import { Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function TeacherPointsPage() {
  const { groups, studentPoints, addStudentPoint } = useTeacherStore();
  const { students } = // useAdminStore (removed) // please use API fetch or server components();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    groupId: "",
    points: "",
    reason: "",
  });

  const studentsWithPoints = students.map((student) => {
    const totalPoints = studentPoints
      .filter((p) => p.studentId === student.id)
      .reduce((sum, p) => sum + p.points, 0);
    return { ...student, totalPoints };
  });

  const filteredStudents = studentsWithPoints.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pointData = {
      studentId: formData.studentId,
      groupId: formData.groupId,
      points: Number(formData.points),
      reason: formData.reason,
      date: new Date().toISOString().split("T")[0],
    };

    addStudentPoint(pointData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      groupId: "",
      points: "",
      reason: "",
    });
    setIsDialogOpen(false);
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      // Find the group the student belongs to, or default to first group if multiple
      const studentGroup = groups.find((g) =>
        g.studentIds.includes(student.id)
      );
      setFormData({
        ...formData,
        studentId: studentId,
        groupId: studentGroup ? studentGroup.id : "",
      });
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Points</h1>
            <p className="text-gray-600">
              Assign and track points for student achievements
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Assign Points
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Points to Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={handleStudentSelect}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="group">Group</Label>
                  <Select
                    value={formData.groupId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, groupId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
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
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({ ...formData, points: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    placeholder="e.g., Excellent participation, completed extra credit"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Assign Points
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Student Points Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Points Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead>Latest Reason</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const latestPoint = studentPoints
                    .filter((p) => p.studentId === student.id)
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )[0];
                  const groupName =
                    groups.find((g) => g.id === latestPoint?.groupId)?.name ||
                    "N/A";

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {student.name}
                      </TableCell>
                      <TableCell>{groupName}</TableCell>
                      <TableCell className="font-bold">
                        {student.totalPoints}
                      </TableCell>
                      <TableCell>
                        {latestPoint?.reason || "No points assigned yet"}
                      </TableCell>
                      <TableCell>{latestPoint?.date || "N/A"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No students found or no points assigned yet.
            </p>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
