import { create } from "zustand";
import { Activity, Payment, Product } from "@/types";
import { Teacher } from "@/types/teacher-types";
import { Student } from "@/types/student-types";
import {
  mockActivities,
  mockPayments,
  mockProducts,
  mockStudents,
  mockTeachers,
} from "@/mock/data";

interface AdminState {
  teachers: Teacher[];
  students: Student[];
  payments: Payment[];
  products: Product[];
  activities: Activity[];

  // Teacher CRUD
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Student CRUD
  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Payment CRUD
  addPayment: (payment: Omit<Payment, "id">) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;

  // Product CRUD
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Activity
  addActivity: (activity: Omit<Activity, "id">) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  teachers: mockTeachers,
  students: mockStudents,
  payments: mockPayments,
  products: mockProducts,
  activities: mockActivities,

  // Teacher CRUD
  addTeacher: (teacher) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    set((state) => ({
      teachers: [...state.teachers, newTeacher],
      activities: [
        {
          id: Date.now().toString(),
          type: "teacher",
          message: `New teacher ${teacher.name} added`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
  },

  updateTeacher: (id, updates) => {
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updates } : teacher
      ),
    }));
  },

  deleteTeacher: (id) => {
    const teacher = get().teachers.find((t) => t.id === id);
    set((state) => ({
      teachers: state.teachers.filter((teacher) => teacher.id !== id),
      activities: [
        {
          id: Date.now().toString(),
          type: "teacher",
          message: `Teacher ${teacher?.name} removed`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
  },

  // Student CRUD
  addStudent: (student) => {
    const newStudent = { ...student, id: Date.now().toString() };
    set((state) => ({
      students: [...state.students, newStudent],
      activities: [
        {
          id: Date.now().toString(),
          type: "registration",
          message: `${student.name} registered for ${student.course}`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
  },

  updateStudent: (id, updates) => {
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      ),
    }));
  },

  deleteStudent: (id) => {
    const student = get().students.find((s) => s.id === id);
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
      activities: [
        {
          id: Date.now().toString(),
          type: "registration",
          message: `Student ${student?.name} removed`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
  },

  // Payment CRUD
  addPayment: (payment) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    set((state) => ({
      payments: [...state.payments, newPayment],
      activities: [
        {
          id: Date.now().toString(),
          type: "payment",
          message: `Payment received from ${payment.studentName}`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
  },

  updatePayment: (id, updates) => {
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === id ? { ...payment, ...updates } : payment
      ),
    }));
  },

  // Product CRUD
  addProduct: (product) => {
    const newProduct = { ...product, id: Date.now().toString() };
    set((state) => ({
      products: [...state.products, newProduct],
      activities: [
        {
          id: Date.now().toString(),
          type: "product",
          message: `${product.name} added to shop`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      ),
    }));
  },

  deleteProduct: (id) => {
    const product = get().products.find((p) => p.id === id);
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      activities: [
        {
          id: Date.now().toString(),
          type: "product",
          message: `${product?.name} removed from shop`,
          timestamp: "Just now",
        },
        ...state.activities,
      ],
    }));
  },

  addActivity: (activity) => {
    set((state) => ({
      activities: [
        { ...activity, id: Date.now().toString() },
        ...state.activities,
      ],
    }));
  },
}));
