import { User, Activity, Payment, Product, UserRole } from "@/types";
import { Student, Achievement } from "@/types/student-types";
import {
  Teacher,
  AttendanceRecord,
  Group,
  Lesson,
  StudentPoint,
  TeacherActivity,
} from "@/types/teacher-types";
import {
  Award,
  BookCheck,
  CalendarCheck,
  MessageSquare,
  Shield,
  ShoppingCart,
} from "lucide-react";

// * Demo accounts data for display
const demoAccounts = [
  {
    role: "admin" as UserRole,
    title: "Admin",
    username: "admin",
    password: "password",
    icon: Shield,
    color: "text-blue-600 bg-blue-50",
  },
  {
    role: "teacher" as UserRole,
    title: "Teacher",
    username: "teacher",
    password: "password",
    icon: MessageSquare,
    color: "text-green-600 bg-green-50",
  },
  {
    role: "student" as UserRole,
    title: "Student",
    username: "student",
    password: "password",
    icon: ShoppingCart,
    color: "text-purple-600 bg-purple-50",
  },
];

// * Mock users data
const mockUsers: User[] = [
  { id: "1", username: "admin", role: "admin", name: "Admin User" },
  { id: "2", username: "teacher", role: "teacher", name: "John Teacher" },
  { id: "3", username: "student", role: "student", name: "Jane Student" },
];

// * Mock data
const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@educrm.com",
    subject: "Mathematics",
    phone: "+1234567890",
    salary: 2500,
    studentCount: 12,
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@educrm.com",
    subject: "English",
    phone: "+1234567891",
    salary: 3000,
    studentCount: 15,
    joinDate: "2024-02-01",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@educrm.com",
    subject: "Science",
    phone: "+1234567892",
    salary: 1800,
    studentCount: 8,
    joinDate: "2024-03-10",
    status: "active",
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa@educrm.com",
    subject: "History",
    phone: "+1234567893",
    salary: 2200,
    studentCount: 10,
    joinDate: "2024-01-20",
    status: "active",
  },
];

const mockStudents: Student[] = [];

const mockPayments: Payment[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Alice Johnson",
    amount: 500,
    date: "2024-07-01",
    status: "completed",
    method: "card",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Bob Smith",
    amount: 450,
    date: "2024-07-15",
    status: "pending",
    method: "cash",
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Notebook",
    description: "High-quality notebook for students",
    price: 25,
    category: "Stationery",
    stock: 50,
    image: "/notebook.png",
  },
  {
    id: "2",
    name: "Scientific Calculator",
    description: "Advanced calculator for math classes",
    price: 85,
    category: "Electronics",
    stock: 20,
    image: "/scientific-calculator.webp",
  },
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "registration",
    message: "Alice Johnson registered for Math class",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "payment",
    message: "Monthly fee payment from Bob Smith",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    type: "product",
    message: "Premium notebook added to shop",
    timestamp: "6 hours ago",
  },
];

// * Mock Achievements for student role
const mockAchievements: Achievement[] = [
  {
    id: "ach1",
    name: "Perfect Attendance",
    description: "Achieved perfect attendance for a month",
    icon: CalendarCheck,
    earnedDate: null,
  },
  {
    id: "ach2",
    name: "Top Scorer",
    description: "Scored 90%+ in a major exam",
    icon: Award,
    earnedDate: null,
  },
  {
    id: "ach3",
    name: "Homework Master",
    description: "Completed all homework assignments for a subject",
    icon: BookCheck,
    earnedDate: null,
  },
  {
    id: "ach4",
    name: "Active Participant",
    description: "Consistently participated in class discussions",
    icon: MessageSquare,
    earnedDate: null,
  },
];

// * Mock Data for teacher role
const mockGroups: Group[] = [];

const mockLessons: Lesson[] = [
  {
    id: "l1",
    groupId: "g1",
    topic: "Introduction to Algebra",
    date: "2024-01-15",
    homework: "Complete exercises 1-10 in Chapter 2",
  },
  {
    id: "l2",
    groupId: "g1",
    topic: "Linear Equations",
    date: "2024-01-17",
    homework: "Solve problems 1-15 in workbook",
  },
  {
    id: "l3",
    groupId: "g3",
    topic: "Newton's Laws of Motion",
    date: "2024-01-16",
    homework: "Read Chapter 3 and answer questions",
  },
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "a1",
    lessonId: "l1",
    groupId: "g1",
    studentId: "1",
    date: "2024-01-15",
    status: "present",
  },
  {
    id: "a2",
    lessonId: "l1",
    groupId: "g1",
    studentId: "2",
    date: "2024-01-15",
    status: "present",
  },
  {
    id: "a3",
    lessonId: "l1",
    groupId: "g1",
    studentId: "3",
    date: "2024-01-15",
    status: "absent",
  },
  {
    id: "a4",
    lessonId: "l3",
    groupId: "g3",
    studentId: "1",
    date: "2024-01-16",
    status: "present",
  },
  {
    id: "a5",
    lessonId: "l3",
    groupId: "g3",
    studentId: "2",
    date: "2024-01-16",
    status: "late",
  },
];

const mockStudentPoints: StudentPoint[] = [
  {
    id: "p1",
    studentId: "1",
    groupId: "g1",
    points: 10,
    reason: "Participated actively in class",
    date: "2024-07-20",
  },
  {
    id: "p2",
    studentId: "2",
    groupId: "g1",
    points: 5,
    reason: "Completed extra homework",
    date: "2024-07-22",
  },
];

const mockTeacherActivities: TeacherActivity[] = [
  {
    id: "ta1",
    type: "lesson",
    message: "Advanced Calculus - Math A group lesson completed",
    timestamp: "1 hour ago",
  },
  {
    id: "ta2",
    type: "homework",
    message: "15 students submitted Physics homework",
    timestamp: "3 hours ago",
  },
  {
    id: "ta3",
    type: "attendance",
    message: "Attendance taken Chemistry A - 14/15 students present",
    timestamp: "5 hours ago",
  },
];

export {
  demoAccounts,
  mockUsers,
  mockTeachers,
  mockStudents,
  mockPayments,
  mockProducts,
  mockActivities,
  mockAchievements,
  mockGroups,
  mockLessons,
  mockAttendanceRecords,
  mockStudentPoints,
  mockTeacherActivities,
};
