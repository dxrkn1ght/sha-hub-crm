import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role",
  }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
