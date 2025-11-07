import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { demoAccounts } from "@/mock/data";

function DemoAccounts() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
        Demo Accounts
      </h3>
      <div className="space-y-3">
        {demoAccounts.map((account) => (
          <Card key={account.role} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  account.color
                )}
              >
                <account.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{account.title}</div>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p>
                Username:{" "}
                <span className="font-semibold">{account.username}</span>
              </p>
              <p>
                Password:{" "}
                <span className="font-semibold">{account.password}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DemoAccounts;
