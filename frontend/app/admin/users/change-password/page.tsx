'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded min-h-screen">
      <h2 className="text-xl font-bold mb-4">Change Your Password</h2>

      <label className="block text-sm mb-1">Current Password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block text-sm mb-1">New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Change Password'}
      </button>
    </div>
  );
}
