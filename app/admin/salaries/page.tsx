"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";
import { AdminLayout } from "@/components/layouts/admin-layout";

export default function SalariesPage() {
  const { teachers } = // useAdminStore (removed) // please use API fetch or server components();

  const totalSalaries = teachers.reduce(
    (sum, teacher) => sum + teacher.salary,
    0
  );
  const avgSalary = totalSalaries / teachers.length;
  const highestPaid = Math.max(...teachers.map((t) => t.salary));

  const teacherPerformanceData = teachers.map((teacher) => ({
    name: teacher.name,
    students: teacher.studentCount,
    salary: teacher.salary,
    efficiency: Math.round((teacher.studentCount / teacher.salary) * 1000) / 10,
  }));

  const salaryTrendData = [
    { month: "Jan", total: 8500 },
    { month: "Feb", total: 9200 },
    { month: "Mar", total: 9800 },
    { month: "Apr", total: 10200 },
    { month: "May", total: 10500 },
    { month: "Jun", total: totalSalaries },
  ];

  const handleExportReport = () => {
    const csvContent = [
      ["Teacher", "Subject", "Students", "Salary", "Efficiency"],
      ...teachers.map((teacher) => [
        teacher.name,
        teacher.subject,
        teacher.studentCount,
        teacher.salary,
        Math.round((teacher.studentCount / teacher.salary) * 1000) / 10,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teacher-salaries-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Teacher Salaries
            </h1>
            <p className="text-gray-600">
              Calculate and manage teacher compensation
            </p>
          </div>
          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Salaries
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalSalaries.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Monthly payroll</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Salary
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(avgSalary).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per teacher</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Highest Salary
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${highestPaid.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Top earner</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teacher Performance & Salary */}
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

          {/* Salary Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Trend</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly salary expenses over time
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  total: {
                    label: "Total Salaries",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salaryTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="var(--color-total)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-total)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Details */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher Salary Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.subject}</p>
                      <p className="text-xs text-gray-500">
                        {teacher.studentCount} students
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${teacher.salary}</div>
                    <div className="text-sm text-gray-600">per month</div>
                    <Badge variant="outline" className="mt-1">
                      {Math.round(
                        (teacher.studentCount / teacher.salary) * 1000
                      ) / 10}{" "}
                      efficiency
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
