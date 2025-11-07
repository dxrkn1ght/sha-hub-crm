// * Interfaces for teacher role
export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  salary: number;
  studentCount: number;
  joinDate: string;
  status: "active" | "inactive";
}

export type LessonDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Group {
  id: string;
  name: string;
  subject: string;
  lessonTime: string; // e.g., "09:00 - 10:30"
  lessonDays: LessonDay[];
  studentIds: string[]; // Array of student IDs
  active: boolean;
}

export interface Lesson {
  id: string;
  groupId: string;
  topic: string;
  date: string; // YYYY-MM-DD
  homework: string;
}

export interface AttendanceRecord {
  id: string;
  lessonId: string;
  groupId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: "present" | "absent" | "late";
}

export interface StudentPoint {
  id: string;
  studentId: string;
  groupId: string;
  points: number;
  reason: string;
  date: string; // YYYY-MM-DD
}

export interface TeacherActivity {
  id: string;
  type: "lesson" | "homework" | "attendance" | "group" | "point";
  message: string;
  timestamp: string;
}
