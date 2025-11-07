"use client";

import { useState } from "react";
import {
  Plus,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Group, LessonDay } from "@/types/teacher-types";

export default function TeacherGroupsPage() {
  const { groups, addGroup, updateGroup, deleteGroup, assignStudentsToGroup } =
    useTeacherStore();
  const { students } = // useAdminStore (removed) // please use API fetch or server components();

  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [isAssignStudentsDialogOpen, setIsAssignStudentsDialogOpen] =
    useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [assigningGroup, setAssigningGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    lessonTime: "",
    lessonDays: [] as LessonDay[],
    studentCount: 0,
  });
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const totalGroups = groups.length;
  const totalStudentsInGroups = groups.reduce(
    (sum, group) => sum + group.studentIds.length,
    0
  );
  const uniqueSubjects = new Set(groups.map((g) => g.subject)).size;

  const lessonDaysOptions: LessonDay[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const groupData = {
      name: formData.name,
      subject: formData.subject,
      lessonTime: formData.lessonTime,
      lessonDays: formData.lessonDays,
      studentIds: editingGroup ? editingGroup.studentIds : [], // Keep existing students if editing
      active: true,
    };

    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }

    resetAddGroupForm();
  };

  const resetAddGroupForm = () => {
    setFormData({
      name: "",
      subject: "",
      lessonTime: "",
      lessonDays: [],
      studentCount: 0,
    });
    setEditingGroup(null);
    setIsAddGroupDialogOpen(false);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      subject: group.subject,
      lessonTime: group.lessonTime,
      lessonDays: group.lessonDays,
      studentCount: group.studentIds.length,
    });
    setIsAddGroupDialogOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this group and all its associated lessons?"
      )
    ) {
      deleteGroup(id);
    }
  };

  const handleAssignStudents = (group: Group) => {
    setAssigningGroup(group);
    setSelectedStudentIds(group.studentIds);
    setIsAssignStudentsDialogOpen(true);
  };

  const handleAssignStudentsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningGroup) {
      assignStudentsToGroup(assigningGroup.id, selectedStudentIds);
    }
    resetAssignStudentsForm();
  };

  const resetAssignStudentsForm = () => {
    setAssigningGroup(null);
    setSelectedStudentIds([]);
    setIsAssignStudentsDialogOpen(false);
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
            <p className="text-gray-600">
              Manage your assigned groups and students
            </p>
          </div>

          <Dialog
            open={isAddGroupDialogOpen}
            onOpenChange={setIsAddGroupDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGroup(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingGroup ? "Edit Group" : "Add New Group"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGroupSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">BASIC INFORMATION</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      placeholder="Enter group name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">SCHEDULE</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lessonTime">Lesson Time</Label>
                    <Input
                      id="lessonTime"
                      type="text"
                      placeholder="HH:MM - HH:MM"
                      value={formData.lessonTime}
                      onChange={(e) =>
                        setFormData({ ...formData, lessonTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentCount">Student Count</Label>
                    <Input
                      id="studentCount"
                      type="number"
                      value={formData.studentCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentCount: Number(e.target.value),
                        })
                      }
                      disabled // This will be updated when students are assigned
                    />
                  </div>
                </div>

                <div>
                  <Label>Lesson Days</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {lessonDaysOptions.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.lessonDays.includes(day)}
                          onCheckedChange={(checked) => {
                            setFormData((prev) => ({
                              ...prev,
                              lessonDays: checked
                                ? [...prev.lessonDays, day]
                                : prev.lessonDays.filter((d) => d !== day),
                            }));
                          }}
                        />
                        <label
                          htmlFor={day}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  >
                    {editingGroup ? "Update Group" : "Add Group"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetAddGroupForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Groups
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGroups}</div>
              <p className="text-xs text-muted-foreground">Active groups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
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
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueSubjects}</div>
              <p className="text-xs text-muted-foreground">
                Different subjects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Groups</CardTitle>
            <p className="text-sm text-muted-foreground">
              Overview of all groups assigned to you
            </p>
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
                      {group.studentIds.length} students
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.lessonDays.map((day) => (
                          <Badge key={day} variant="secondary">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {group.lessonTime}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={
                            isAssignStudentsDialogOpen &&
                            assigningGroup?.id === group.id
                          }
                          onOpenChange={setIsAssignStudentsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAssignStudents(group)}
                            >
                              <UserPlus className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>
                                Assign Students to {assigningGroup?.name}
                              </DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handleAssignStudentsSubmit}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="students">
                                  Select Students
                                </Label>
                                <MultiSelector
                                  values={selectedStudentIds}
                                  onValuesChange={setSelectedStudentIds}
                                  loop={false}
                                  className="w-full"
                                >
                                  <MultiSelectorTrigger>
                                    <MultiSelectorInput placeholder="Select students" />
                                  </MultiSelectorTrigger>
                                  <MultiSelectorContent>
                                    <MultiSelectorList>
                                      {students.map((student) => (
                                        <MultiSelectorItem
                                          key={student.id}
                                          value={student.id}
                                        >
                                          {student.name}
                                        </MultiSelectorItem>
                                      ))}
                                    </MultiSelectorList>
                                  </MultiSelectorContent>
                                </MultiSelector>
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                  Assign Students
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={resetAssignStudentsForm}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No groups found. Add a new group to get started!
            </p>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
