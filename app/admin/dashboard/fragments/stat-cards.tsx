import { Users, GraduationCap, DollarSign, TrendingUp } from "lucide-react";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";
import { StatCard } from "./stat-card";

function StatCards() {
  const { teachers, students, payments } = // useAdminStore (removed) // please use API fetch or server components();

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const statsCards = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      description: "+2 from last month",
      trend: "up" as const,
    },
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: GraduationCap,
      description: "+1 from last month",
      trend: "up" as const,
    },
    {
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "+12% from last month",
      trend: "up" as const,
    },
    {
      title: "Growth Rate",
      value: "+15%",
      icon: TrendingUp,
      description: "+2% from last month",
      trend: "up" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

export default StatCards;
