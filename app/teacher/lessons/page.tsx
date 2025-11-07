"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Plus, BookOpen, Calendar, Edit, Trash2, Home } from "lucide-react";
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
import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { Lesson } from "@/types/teacher-types";

export default function TeacherLessonsPage() {
  const { groups, lessons, addLesson, updateLesson, deleteLesson } =
    useTeacherStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    groupId: "",
    topic: "",
    date: "",
    homework: "",
  });

  const totalLessons = lessons.length;
  const activeGroupsWithLessons = new Set(lessons.map((l) => l.groupId)).size;
  const lessonsThisMonth = lessons.filter((l) => {
    const lessonDate = new Date(l.date);
    const now = new Date();
    return (
      lessonDate.getMonth() === now.getMonth() &&
      lessonDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lessonData = {
      groupId: formData.groupId,
      topic: formData.topic,
      date: formData.date,
      homework: formData.homework,
    };

    if (editingLesson) {
      updateLesson(editingLesson.id, lessonData);
    } else {
      addLesson(lessonData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      groupId: "",
      topic: "",
      date: "",
      homework: "",
    });
    setEditingLesson(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      groupId: lesson.groupId,
      topic: lesson.topic,
      date: lesson.date,
      homework: lesson.homework,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      deleteLesson(id);
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
            <p className="text-gray-600">
              Create and manage lessons for your groups
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingLesson(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLesson ? "Edit Lesson" : "Create New Lesson"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="groupId">Group</Label>
                  <Select
                    value={formData.groupId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, groupId: value })
                    }
                    required
                  >
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
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="homework">Homework</Label>
                  <Textarea
                    id="homework"
                    value={formData.homework}
                    onChange={(e) =>
                      setFormData({ ...formData, homework: e.target.value })
                    }
                    placeholder="e.g., Complete exercises 1-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingLesson ? "Update" : "Create"} Lesson
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
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
                Total Lessons
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <p className="text-xs text-muted-foreground">Created lessons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Groups
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />{" "}
              {/* Declare Users component */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeGroupsWithLessons}
              </div>
              <p className="text-xs text-muted-foreground">With lessons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessonsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Lessons this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lessons by Group */}
        <div className="space-y-6">
          {groups.map((group) => {
            const groupLessons = lessons.filter(
              (lesson) => lesson.groupId === group.id
            );
            if (groupLessons.length === 0) return null; // Only show groups with lessons

            return (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {group.name}{" "}
                    <span className="text-base text-gray-600 font-normal">
                      ({group.subject})
                    </span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Lessons for {group.name} - {group.lessonDays.join(", ")} at{" "}
                    {group.lessonTime}
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Homework</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupLessons.map((lesson) => (
                        <TableRow key={lesson.id}>
                          <TableCell className="font-medium">
                            {lesson.topic}
                          </TableCell>
                          <TableCell>{lesson.date}</TableCell>
                          <TableCell className="flex items-center gap-1">
                            <Home className="w-4 h-4 text-muted-foreground" />
                            {lesson.homework}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(lesson)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(lesson.id)}
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
            );
          })}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No lessons created yet. Create your first lesson!
            </p>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
