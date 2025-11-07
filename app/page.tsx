"use client";

import { Lock } from "lucide-react";
import LoginForm from "./login-form";
// import DemoAccounts from "./demo-accounts";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto p-8 bg-white shadow-xl rounded-lg">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div className="size-16 bg-gradient-to-br from-stone-100 to-neutral-100 rounded-full flex items-center justify-center">
            <Lock className="size-8 text-black" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600">Enter your credentials to login</p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Demo Accounts Display */}
        {/* <DemoAccounts /> */}
      </div>
    </div>
  );
}
