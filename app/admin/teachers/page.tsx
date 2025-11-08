"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/stores/admin-store"
import { AdminLayout } from "@/components/layouts/admin-layout"
import type { Teacher } from "@/types/teacher-types"
import { TeacherFormDialog, TeachersTable } from "./fragments"

type TeacherFormValues = {
  name: string
  email: string
  phone: string
  subject: string
  salary: number
  studentCount: number
  status: "active" | "inactive"
  username: string
  password: string
}

export default function TeachersPage() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFormSubmit = (formData: TeacherFormValues, teacherToEdit: Teacher | null) => {
    const teacherData = {
      ...formData,
      salary: Number(formData.salary),
      studentCount: Number(formData.studentCount),
      joinDate: teacherToEdit?.joinDate || new Date().toISOString().split("T")[0],
    }

    if (teacherToEdit) {
      updateTeacher(teacherToEdit.id, teacherData)
    } else {
      addTeacher(teacherData)
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      deleteTeacher(id)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
            <p className="text-gray-600">Manage teacher information and login credentials</p>
          </div>
          <Button
            onClick={() => {
              setEditingTeacher(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="size-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>List of Teachers ({filteredTeachers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <TeachersTable teachers={filteredTeachers} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No teachers found</p>
          </div>
        )}

        <TeacherFormDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          onSubmit={handleFormSubmit}
          editingTeacher={editingTeacher}
          setEditingTeacher={setEditingTeacher}
        />
      </div>
    </AdminLayout>
  )
}
