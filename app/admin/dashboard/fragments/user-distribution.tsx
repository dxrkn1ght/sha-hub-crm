import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Cell, Pie, ResponsiveContainer } from "recharts";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";

function UserDistribution() {
  const { students, teachers } = // useAdminStore (removed) // please use API fetch or server components();

  const totalUsers = students.length + teachers.length + 1; // +1 for admin
  const userDistribution = [
    {
      name: "Students",
      value: Math.round((students.length / totalUsers) * 100),
      color: "#3b82f6",
    },
    {
      name: "Teachers",
      value: Math.round((teachers.length / totalUsers) * 100),
      color: "#10b981",
    },
    {
      name: "Admins",
      value: Math.round((1 / totalUsers) * 100),
      color: "#f59e0b",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of users by role
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            students: { label: "Students", color: "#3b82f6" },
            teachers: { label: "Teachers", color: "#10b981" },
            admins: { label: "Admins", color: "#f59e0b" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex justify-center gap-4 mt-4">
          {userDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default UserDistribution;
