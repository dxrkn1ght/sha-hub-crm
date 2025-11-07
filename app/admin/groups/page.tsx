"use client";
import React from "react";
import { // useAdminStore (removed) // please use API fetch or server components } from "@/stores/admin-store";

export default function AdminGroupsPage() {
  const groups = // useAdminStore (removed) // please use API fetch or server components((s) => s.groups);
  const students = // useAdminStore (removed) // please use API fetch or server components((s) => s.students);
  const attendance = // useAdminStore (removed) // please use API fetch or server components((s) => s.attendanceRecords);
  const studentPoints = // useAdminStore (removed) // please use API fetch or server components((s) => s.studentPoints);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin — Groups (Shon's-HUB)</h1>
      {groups.length === 0 ? (
        <div className="text-muted">No groups available. Create groups from the admin panel.</div>
      ) : (
        <div className="grid gap-4">
          {groups.map((g) => (
            <div key={g.id} className="border p-4 rounded">
              <h2 className="font-medium">{g.name} — {g.subject}</h2>
              <div className="text-sm">Lesson Time: {g.lessonTime} — Days: {g.lessonDays?.join(", ")}</div>
              <div className="mt-2">
                <strong>Students:</strong>
                <ul className="list-disc ml-6">
                  {g.studentIds?.map((sid) => {
                    const st = students.find((s) => s.id === sid);
                    return <li key={sid}>{st ? st.name : `Student ${sid}`}</li>;
                  })}
                </ul>
              </div>

              <div className="mt-3">
                <strong>Attendance (latest records):</strong>
                <ul className="list-disc ml-6">
                  {attendance
                    .filter((a) => a.groupId === g.id)
                    .slice(0,5)
                    .map((a) => (
                      <li key={a.id}>{a.date} — Present: {a.presentStudentIds.length} / {g.studentIds?.length || 0}</li>
                    ))}
                </ul>
              </div>

              <div className="mt-3">
                <strong>Student Points:</strong>
                <ul className="list-disc ml-6">
                  {studentPoints
                    .filter((p) => g.studentIds?.includes(p.studentId))
                    .map((p) => (
                      <li key={p.id}>{p.studentId}: {p.points} pts</li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
