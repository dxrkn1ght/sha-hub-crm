"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Users, BookOpen, Clock, Award, Edit, Trash2, UserPlus, UserMinus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTeacherStore } from "@/stores/teacher-store"
import { useAdminStore } from "@/stores/admin-store"
import { AdminLayout } from "@/components/layouts/admin-layout"
import type { Group, LessonDay } from "@/types/teacher-types"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminGroupsPage() {
  const { groups, addGroup, updateGroup, deleteGroup, assignStudentsToGroup } = useTeacherStore()
  const { students, teachers } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false)
  const [selectedGroupForStudents, setSelectedGroupForStudents] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    lessonTime: "",
    lessonDays: [] as LessonDay[],
    teacherId: "",
    description: "",
  })

  const weekDays: LessonDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const totalGroups = groups.length
  const totalStudentsInGroups = groups.reduce((sum, group) => sum + group.studentIds.length, 0)
  const activeGroups = groups.filter((g) => g.active).length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const groupData = {
      name: formData.name,
      subject: formData.subject,
      lessonTime: formData.lessonTime,
      lessonDays: formData.lessonDays,
      teacherId: formData.teacherId || undefined,
      description: formData.description,
      studentIds: editingGroup?.studentIds || [],
    }

    if (editingGroup) {
      updateGroup(editingGroup.id, groupData)
    } else {
      addGroup(groupData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      lessonTime: "",
      lessonDays: [],
      teacherId: "",
      description: "",
    })
    setEditingGroup(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      subject: group.subject,
      lessonTime: group.lessonTime,
      lessonDays: group.lessonDays,
      teacherId: group.teacherId || "",
      description: group.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this group?")) {
      deleteGroup(id)
    }
  }

  const handleDayToggle = (day: LessonDay) => {
    setFormData((prev) => ({
      ...prev,
      lessonDays: prev.lessonDays.includes(day) ? prev.lessonDays.filter((d) => d !== day) : [...prev.lessonDays, day],
    }))
  }

  const openManageStudents = (groupId: string) => {
    setSelectedGroupForStudents(groupId)
    setIsManageStudentsOpen(true)
  }

  const handleStudentToggle = (studentId: string) => {
    if (!selectedGroupForStudents) return

    const group = groups.find((g) => g.id === selectedGroupForStudents)
    if (!group) return

    const isCurrentlyInGroup = group.studentIds.includes(studentId)

    if (isCurrentlyInGroup) {
      // Remove student from group
      assignStudentsToGroup(
        selectedGroupForStudents,
        group.studentIds.filter((id) => id !== studentId),
      )
    } else {
      // Add student to group
      assignStudentsToGroup(selectedGroupForStudents, [...group.studentIds, studentId])
    }
  }

  const selectedGroup = groups.find((g) => g.id === selectedGroupForStudents)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Groups Management</h1>
            <p className="text-gray-600">Create and manage student groups</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGroup(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingGroup ? "Edit Group" : "Create New Group"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Group Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Math A1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g., Mathematics"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lessonTime">Lesson Time</Label>
                  <Input
                    id="lessonTime"
                    value={formData.lessonTime}
                    onChange={(e) => setFormData({ ...formData, lessonTime: e.target.value })}
                    placeholder="e.g., 09:00 - 10:30"
                    required
                  />
                </div>

                <div>
                  <Label>Lesson Days</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weekDays.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.lessonDays.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
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

                <div>
                  <Label htmlFor="teacherId">Assign Teacher (Optional)</Label>
                  <Select
                    value={formData.teacherId}
                    onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No teacher assigned</SelectItem>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the group"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingGroup ? "Update" : "Create"} Group
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
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGroups}</div>
              <p className="text-xs text-muted-foreground">{activeGroups} active</p>
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
              <CardTitle className="text-sm font-medium">Avg Group Size</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalGroups > 0 ? Math.round(totalStudentsInGroups / totalGroups) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Students per group</p>
            </CardContent>
          </Card>
        </div>

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => {
                  const teacher = teachers.find((t) => t.id === group.teacherId)
                  return (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{group.subject}</TableCell>
                      <TableCell>
                        {teacher ? (
                          <span className="text-sm">{teacher.name}</span>
                        ) : (
                          <Badge variant="secondary">No teacher</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {group.studentIds.length}
                        </div>
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
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{group.lessonTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={group.active ? "default" : "secondary"}>
                          {group.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openManageStudents(group.id)}>
                            <UserPlus className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(group)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(group.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Manage Students Dialog */}
        <Dialog open={isManageStudentsOpen} onOpenChange={setIsManageStudentsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Students - {selectedGroup?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Select students to add or remove from this group</div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {students.map((student) => {
                  const isInGroup = selectedGroup?.studentIds.includes(student.id)
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                      <Button
                        size="sm"
                        variant={isInGroup ? "destructive" : "default"}
                        onClick={() => handleStudentToggle(student.id)}
                      >
                        {isInGroup ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {groups.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No groups found yet. Create your first group!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
