"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentStore } from "@/stores/student-store";
import { StudentLayout } from "@/components/layouts/student-layout";
import { cn } from "@/lib/utils";

export default function StudentAchievementsPage() {
  const { achievements } = useStudentStore();

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Achievements</h1>
          <p className="text-gray-600">
            View your earned badges and milestones
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            return (
              <Card
                key={achievement.id}
                className={cn(
                  achievement.earnedDate ? "border-blue-500" : "border-gray-200"
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{achievement.name}</CardTitle>
                  {achievement.earnedDate && (
                    <span className="text-xs text-blue-600 font-medium">
                      Earned: {achievement.earnedDate}
                    </span>
                  )}
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      achievement.earnedDate
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {<achievement.icon className="w-8 h-8" />}
                  </div>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No achievements yet. Keep up the great work!
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
