import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Education CRM",
  description:
    "Education CRM is a comprehensive platform for managing educational institutions, students, and teachers.",
  keywords: [
    "education",
    "CRM",
    "student management",
    "teacher management",
    "course management",
    "attendance",
    "grades",
    "payments",
    "activities",
    "products",
    "achievements",
    "user management",
    "dashboard",
    "admin panel",
    "school management",
    "college management",
    "university management",
    "learning management system",
    "LMS",
    "education software",
    "student portal",
    "teacher portal",
    "admin portal",
    "education platform",
    "education management system",
    "educational software",
    "student information system",
  ],
  authors: [
    {
      name: "Asadbek Rakhimov",
      url: "https://www.linkedin.com/in/asadbek-rakhimov",
    },
  ],
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
    shortcut: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
