import { z } from "zod"

export const teacherFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  subject: z.string().min(1, "Subject is required"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  studentCount: z.coerce.number().min(0, "Student count must be a positive number"),
  status: z.enum(["active", "inactive"]),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type TeacherFormValues = z.infer<typeof teacherFormSchema>
