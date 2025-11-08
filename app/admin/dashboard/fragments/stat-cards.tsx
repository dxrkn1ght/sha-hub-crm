import { Users, GraduationCap, DollarSign, TrendingUp } from "lucide-react"
import { useAdminStore } from "@/stores/admin-store"
import { StatCard } from "./stat-card"

function StatCards() {
  const { teachers, students, payments } = useAdminStore()

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

  const activeStudents = students.filter((s) => s.status === "active").length
  const activeTeachers = teachers.filter((t) => t.status === "active").length

  const statsCards = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      description: `${activeStudents} active students`,
      trend: "up" as const,
    },
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: GraduationCap,
      description: `${activeTeachers} active teachers`,
      trend: "up" as const,
    },
    {
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Total revenue collected",
      trend: "up" as const,
    },
    {
      title: "Growth Rate",
      value: "+15%",
      icon: TrendingUp,
      description: "Compared to last month",
      trend: "up" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  )
}

export default StatCards
