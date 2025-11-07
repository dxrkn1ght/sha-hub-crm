"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useStudentStore } from "@/stores/student-store";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { setStudentId } = useStudentStore(); // Get setStudentId from student store
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Set student ID in student store if user is a student
    if (user.role === "student") {
      setStudentId(user.id);
    }

    // Redirect based on user role
    switch (user.role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "teacher":
        router.push("/teacher/dashboard");
        break;
      case "student":
        router.push("/student/dashboard");
        break;
      default:
        router.push("/");
    }
  }, [user, router, setStudentId]); // Add setStudentId to dependencies

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
