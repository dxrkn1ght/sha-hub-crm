import { create } from "zustand"
import type { AttendanceRecord, Group, Lesson, StudentPoint, TeacherActivity } from "@/types/teacher-types"
import type { StudentMark } from "@/types/student-types"
import { mockAttendanceRecords, mockGroups, mockLessons, mockStudentPoints, mockTeacherActivities } from "@/mock/data"

interface TeacherState {
  groups: Group[]
  lessons: Lesson[]
  attendanceRecords: AttendanceRecord[]
  studentPoints: StudentPoint[]
  teacherActivities: TeacherActivity[]
  studentMarks: StudentMark[]

  // Group CRUD
  addGroup: (group: Omit<Group, "id" | "active">) => void
  updateGroup: (id: string, group: Partial<Group>) => void
  deleteGroup: (id: string) => void
  assignStudentsToGroup: (groupId: string, studentIds: string[]) => void

  // Lesson CRUD
  addLesson: (lesson: Omit<Lesson, "id">) => void
  updateLesson: (id: string, lesson: Partial<Lesson>) => void
  deleteLesson: (id: string) => void

  // Attendance
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => void
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void
  getAttendanceForLesson: (lessonId: string) => AttendanceRecord[]

  // Points
  addStudentPoint: (point: Omit<StudentPoint, "id">) => void
  getStudentPoints: (studentId: string) => StudentPoint[]

  addStudentMark: (mark: Omit<StudentMark, "id">) => void
  updateStudentMark: (id: string, mark: Partial<StudentMark>) => void
  getStudentMarks: (studentId: string) => StudentMark[]

  // Activities
  addTeacherActivity: (activity: Omit<TeacherActivity, "id">) => void
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  groups: mockGroups,
  lessons: mockLessons,
  attendanceRecords: mockAttendanceRecords,
  studentPoints: mockStudentPoints,
  teacherActivities: mockTeacherActivities,
  studentMarks: [],

  // Group CRUD
  addGroup: (group) => {
    const newGroup = { ...group, id: `g${Date.now()}`, active: true }
    set((state) => ({
      groups: [...state.groups, newGroup],
      teacherActivities: [
        {
          id: `ta${Date.now()}`,
          type: "group",
          message: `New group "${group.name}" created`,
          timestamp: "Just now",
        },
        ...state.teacherActivities,
      ],
    }))
  },
  updateGroup: (id, updates) => {
    set((state) => ({
      groups: state.groups.map((group) => (group.id === id ? { ...group, ...updates } : group)),
    }))
  },
  deleteGroup: (id) => {
    const group = get().groups.find((g) => g.id === id)
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
      lessons: state.lessons.filter((lesson) => lesson.groupId !== id),
      teacherActivities: [
        {
          id: `ta${Date.now()}`,
          type: "group",
          message: `Group "${group?.name}" deleted`,
          timestamp: "Just now",
        },
        ...state.teacherActivities,
      ],
    }))
  },
  assignStudentsToGroup: (groupId, studentIds) => {
    set((state) => ({
      groups: state.groups.map((group) => (group.id === groupId ? { ...group, studentIds } : group)),
    }))
  },

  // Lesson CRUD
  addLesson: (lesson) => {
    const newLesson = { ...lesson, id: `l${Date.now()}` }
    const group = get().groups.find((g) => g.id === lesson.groupId)
    set((state) => ({
      lessons: [...state.lessons, newLesson],
      teacherActivities: [
        {
          id: `ta${Date.now()}`,
          type: "lesson",
          message: `New lesson "${lesson.topic}" added to group ${group?.name || "Unknown"}`,
          timestamp: "Just now",
        },
        ...state.teacherActivities,
      ],
    }))
  },
  updateLesson: (id, updates) => {
    set((state) => ({
      lessons: state.lessons.map((lesson) => (lesson.id === id ? { ...lesson, ...updates } : lesson)),
    }))
  },
  deleteLesson: (id) => {
    const lesson = get().lessons.find((l) => l.id === id)
    set((state) => ({
      lessons: state.lessons.filter((lesson) => lesson.id !== id),
      attendanceRecords: state.attendanceRecords.filter((record) => record.lessonId !== id),
      teacherActivities: [
        {
          id: `ta${Date.now()}`,
          type: "lesson",
          message: `Lesson "${lesson?.topic}" deleted`,
          timestamp: "Just now",
        },
        ...state.teacherActivities,
      ],
    }))
  },

  // Attendance
  addAttendanceRecord: (record) => {
    const newRecord = { ...record, id: `a${Date.now()}` }
    set((state) => ({
      attendanceRecords: [...state.attendanceRecords, newRecord],
    }))
  },
  updateAttendanceRecord: (id, updates) => {
    set((state) => ({
      attendanceRecords: state.attendanceRecords.map((record) =>
        record.id === id ? { ...record, ...updates } : record,
      ),
    }))
  },
  getAttendanceForLesson: (lessonId) => {
    return get().attendanceRecords.filter((record) => record.lessonId === lessonId)
  },

  // Points
  addStudentPoint: (point) => {
    const newPoint = { ...point, id: `p${Date.now()}` }
    set((state) => ({
      studentPoints: [...state.studentPoints, newPoint],
      teacherActivities: [
        {
          id: `ta${Date.now()}`,
          type: "point",
          message: `Assigned ${point.points} points for "${point.reason}"`,
          timestamp: "Just now",
        },
        ...state.teacherActivities,
      ],
    }))
  },
  getStudentPoints: (studentId) => {
    return get().studentPoints.filter((point) => point.studentId === studentId)
  },

  addStudentMark: (mark) => {
    const newMark = { ...mark, id: `m${Date.now()}` }
    set((state) => ({
      studentMarks: [...state.studentMarks, newMark],
    }))
  },
  updateStudentMark: (id, updates) => {
    set((state) => ({
      studentMarks: state.studentMarks.map((mark) => (mark.id === id ? { ...mark, ...updates } : mark)),
    }))
  },
  getStudentMarks: (studentId) => {
    return get().studentMarks.filter((mark) => mark.studentId === studentId)
  },

  // Activities
  addTeacherActivity: (activity) => {
    set((state) => ({
      teacherActivities: [{ ...activity, id: `ta${Date.now()}` }, ...state.teacherActivities],
    }))
  },
}))
