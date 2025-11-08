"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { useStudentStore } from "@/stores/student-store"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { setStudentId } = useStudentStore()
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Dashboard redirect - user:", user)

    if (!user) {
      console.log("[v0] No user found, redirecting to login")
      router.push("/")
      return
    }

    // Set student ID in student store if user is a student
    if (user.role === "student") {
      setStudentId(user.id)
    }

    // Redirect based on user role
    switch (user.role) {
      case "admin":
        console.log("[v0] Redirecting admin to /admin/dashboard")
        router.push("/admin/dashboard")
        break
      case "teacher":
        console.log("[v0] Redirecting teacher to /teacher/dashboard")
        router.push("/teacher/dashboard")
        break
      case "student":
        console.log("[v0] Redirecting student to /student/dashboard")
        router.push("/student/dashboard")
        break
      default:
        console.log("[v0] Unknown role, redirecting to login")
        router.push("/")
    }
  }, [user, router, setStudentId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
