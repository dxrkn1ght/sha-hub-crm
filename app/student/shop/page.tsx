"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Award } from "lucide-react";
import { useStudentStore } from "@/stores/student-store";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";
import { StudentLayout } from "@/components/layouts/student-layout";
import { cn } from "@/lib/utils";

export default function StudentShopPage() {
  const { totalPoints, studentActivities, spendPoints, earnPoints } =
    useStudentStore();
  const { products } = // useAdminStore (removed) // please use API fetch or server components();

  // Mock shop items, including some non-physical items
  const shopItems = [
    ...products,
    {
      id: "discount1",
      name: "Discount Voucher",
      description: "10% discount on next month fees",
      price: 100,
      category: "Voucher",
      stock: 999, // Unlimited
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "extracredit",
      name: "Extra Credit Pass",
      description: "Get +5 points on your next assignment",
      price: 50,
      category: "Boost",
      stock: 999,
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  const handleBuyItem = (item: (typeof shopItems)[0]) => {
    if (spendPoints(item.price, item.name)) {
      alert(
        `You successfully bought ${item.name}! Points remaining: ${
          totalPoints - item.price
        }`
      );
      // Here you might add logic to "deliver" the item, e.g., update student's discount status or give actual extra credit
    } else {
      alert(
        `Not enough points to buy ${item.name}. You need ${item.price} points.`
      );
    }
  };

  const howToEarnPoints = [
    { title: "Perfect Attendance", description: "+15 points per week" },
    { title: "Homework Completion", description: "+10 points per assignment" },
    { title: "Class Participation", description: "+5 points per class" },
    { title: "High Scores", description: "+20 points for 90%+ scores" },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* My Points */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Spend your earned points on rewards and discounts
            </p>
            <div className="text-4xl font-bold mt-2">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">Available points</p>
          </CardContent>
        </Card>

        {/* Shop Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Award className="w-4 h-4" />
                    {item.price} points
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleBuyItem(item)}
                    disabled={totalPoints < item.price}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Points History */}
        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your recent points transactions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        activity.type === "earned"
                          ? "bg-green-500"
                          : "bg-red-500"
                      )}
                    />
                    <p className="text-sm text-gray-900">{activity.message}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        activity.type === "earned"
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {activity.pointsChange > 0
                        ? `+${activity.pointsChange}`
                        : activity.pointsChange}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Earn Points */}
        <Card>
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ways to earn more points.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {howToEarnPoints.map((item, index) => (
                <Card key={index} className="p-4">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
