"use client";
import React from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  username: string;
  name?: string;
  password: string;
  email?: string;
  phone?: string;
  subject?: string;
};

export default function AdminTeachersPage() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed');
      setMessage('Teacher created: ' + json.user.username);
      reset();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin — Create Teacher</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-3">
        <div>
          <label className="block text-sm">Username</label>
          <input {...register('username')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Name</label>
          <input {...register('name')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register('password')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input {...register('email')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Phone</label>
          <input {...register('phone')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Subject</label>
          <input {...register('subject')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <button className="px-4 py-2 rounded bg-slate-700 text-white" disabled={loading}>
            {loading ? 'Creating...' : 'Create Teacher'}
          </button>
        </div>
        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
    </div>
  );
}
