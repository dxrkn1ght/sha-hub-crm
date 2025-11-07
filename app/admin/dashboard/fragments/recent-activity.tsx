import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";

function RecentActivity() {
  const { activities } = // useAdminStore (removed) // please use API fetch or server components();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest activities in the system
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 6).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === "registration"
                    ? "bg-green-500"
                    : activity.type === "payment"
                    ? "bg-blue-500"
                    : activity.type === "product"
                    ? "bg-yellow-500"
                    : "bg-purple-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
