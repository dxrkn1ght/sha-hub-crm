"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore } from "@/stores/admin-store";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Teacher } from "@/types/teacher-types";
import { TeacherFormDialog, TeachersTable } from "./fragments";
import { TeacherFormValues } from "./fragments/teacher.schema";

export default function TeachersPage() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } =
    useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (
    formData: TeacherFormValues,
    teacherToEdit: Teacher | null
  ) => {
    const teacherData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      salary: Number(formData.salary),
      studentCount: Number(formData.studentCount),
      status: formData.status,
      joinDate:
        teacherToEdit?.joinDate || new Date().toISOString().split("T")[0],
    };

    if (teacherToEdit) {
      updateTeacher(teacherToEdit.id, teacherData);
    } else {
      addTeacher(teacherData);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      deleteTeacher(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
            <p className="text-gray-600">Manage teacher information</p>
          </div>
          <TeacherFormDialog
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
            onSubmit={handleFormSubmit}
            editingTeacher={editingTeacher}
            setEditingTeacher={setEditingTeacher}
          />
        </div>

        {/* Search */}
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
            <CardTitle>List of Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <TeachersTable
              teachers={filteredTeachers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No teachers found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
