"use client"

import { GraduationCap, Sparkles } from "lucide-react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Main card */}
      <div className="w-full max-w-md mx-auto relative">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20">
          {/* Logo and brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="size-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="size-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="size-6 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Shon's-HUB
            </h1>
            <p className="text-gray-600 mt-2 text-center">Modern Education Management System</p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">Secure access to your education portal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
