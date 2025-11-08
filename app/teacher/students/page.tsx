"use client"

import { useState } from "react"
import { Search, UserPlus, UserMinus, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminStore } from "@/stores/admin-store"
import { useTeacherStore } from "@/stores/teacher-store"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function TeacherStudentsPage() {
  const { students, updateStudent } = useAdminStore()
  const { groups, updateGroup } = useTeacherStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterGroup, setFilterGroup] = useState<string>("all")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<string>("")

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGroup =
      filterGroup === "all" || (filterGroup === "unassigned" && !student.groupId) || student.groupId === filterGroup

    return matchesSearch && matchesGroup
  })

  const handleAssignToGroup = () => {
    if (!selectedStudent || !selectedGroup) return

    const student = students.find((s) => s.id === selectedStudent)
    if (!student) return

    // Update student with new group
    updateStudent(selectedStudent, { groupId: selectedGroup })

    // Update group to include student
    const group = groups.find((g) => g.id === selectedGroup)
    if (group && !group.studentIds.includes(selectedStudent)) {
      updateGroup(selectedGroup, {
        studentIds: [...group.studentIds, selectedStudent],
      })
    }

    setIsAssignDialogOpen(false)
    setSelectedStudent("")
    setSelectedGroup("")
  }

  const handleRemoveFromGroup = (studentId: string, groupId: string) => {
    if (confirm("Remove this student from the group?")) {
      // Remove student from group
      updateStudent(studentId, { groupId: undefined })

      // Update group to remove student
      const group = groups.find((g) => g.id === groupId)
      if (group) {
        updateGroup(groupId, {
          studentIds: group.studentIds.filter((id) => id !== studentId),
        })
      }
    }
  }

  const getGroupName = (groupId?: string) => {
    if (!groupId) return "Not Assigned"
    const group = groups.find((g) => g.id === groupId)
    return group ? `${group.name} (${group.subject})` : "Unknown Group"
  }

  // Calculate stats
  const totalStudents = students.length
  const assignedStudents = students.filter((s) => s.groupId).length
  const unassignedStudents = totalStudents - assignedStudents

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">Manage students and group assignments</p>
          </div>

          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign to Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Student to Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students
                        .filter((s) => !s.groupId)
                        .map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - {student.course}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="group">Select Group</Label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.subject}) - {group.studentIds.length}/{group.capacity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAssignToGroup} className="flex-1">
                    Assign
                  </Button>
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <Users className="size-12 text-indigo-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assigned to Groups</p>
                  <p className="text-3xl font-bold text-green-600">{assignedStudents}</p>
                </div>
                <Users className="size-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unassigned</p>
                  <p className="text-3xl font-bold text-orange-600">{unassignedStudents}</p>
                </div>
                <Users className="size-12 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student List ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      <Badge variant={student.groupId ? "default" : "secondary"}>{getGroupName(student.groupId)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {student.groupId ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFromGroup(student.id, student.groupId!)}
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student.id)
                            setIsAssignDialogOpen(true)
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}
