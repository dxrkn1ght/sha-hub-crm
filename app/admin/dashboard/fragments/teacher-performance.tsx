import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

function TeacherPerformance() {
  const { teachers } = // useAdminStore (removed) // please use API fetch or server components();

  const teacherPerformanceData = teachers.map((teacher) => ({
    name: teacher.name,
    students: teacher.studentCount,
    salary: teacher.salary,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Performance & Salary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Teacher performance based on student count and calculated salary
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            students: {
              label: "Students",
              color: "hsl(var(--chart-1))",
            },
            salary: {
              label: "Salary",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                yAxisId="left"
                dataKey="students"
                fill="var(--color-students)"
              />
              <Bar
                yAxisId="right"
                dataKey="salary"
                fill="var(--color-salary)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default TeacherPerformance;
