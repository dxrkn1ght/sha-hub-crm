"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Teacher } from "@/types/teacher-types";
import { teacherFormSchema, TeacherFormValues } from "./teacher.schema";

type TeacherFormDialogProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
  onSubmit: (
    formData: TeacherFormValues,
    editingTeacher: Teacher | null
  ) => void;
  editingTeacher: Teacher | null;
  setEditingTeacher: (teacher: Teacher | null) => void;
};

function TeacherFormDialog({
  open,
  setOpen,
  onSubmit,
  editingTeacher,
  setEditingTeacher,
}: TeacherFormDialogProps) {
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      salary: 0,
      studentCount: 0,
      status: "active",
    },
  });

  useEffect(() => {
    if (editingTeacher) {
      form.reset({
        name: editingTeacher.name,
        email: editingTeacher.email,
        phone: editingTeacher.phone,
        subject: editingTeacher.subject,
        salary: editingTeacher.salary,
        studentCount: editingTeacher.studentCount,
        status: editingTeacher.status,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        subject: "",
        salary: 0,
        studentCount: 0,
        status: "active",
      });
    }
  }, [editingTeacher, open]);

  const handleSubmit = (values: TeacherFormValues) => {
    onSubmit(values, editingTeacher);
    setEditingTeacher(null);
    setOpen(false);
    form.reset();
  };

  const handleCancel = () => {
    setEditingTeacher(null);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setEditingTeacher(null)}>
          <Plus className="size-4 mr-2" />
          Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Salary ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Students Assigned</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingTeacher ? "Update" : "Add"} Teacher
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default TeacherFormDialog;
