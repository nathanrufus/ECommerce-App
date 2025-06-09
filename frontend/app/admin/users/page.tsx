'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link'; 

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const { token, isAdmin, loading, user } = useAuth(); // include user info
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid user data');
        setUsers(data);
      } catch (err) {
        toast.error('Failed to fetch users');
      }
    };

    if (token && isAdmin) fetchUsers();
  }, [token, isAdmin, loading]);

  const promoteUser = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/promote`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to promote user');
      toast.success('User promoted to admin');
      setUsers(prev => prev.map(u => (u._id === id ? { ...u, role: 'admin' } : u)));
    } catch (err) {
      toast.error('Error promoting user');
    }
  };

  const demoteUser = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/demote`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to demote user');
      toast.success('User demoted to customer');
      setUsers(prev => prev.map(u => (u._id === id ? { ...u, role: 'customer' } : u)));
    } catch (err) {
      toast.error('Error demoting user');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link
          href="/admin/users/change-password"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          Change My Password
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2 space-x-2">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => promoteUser(u._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Promote to Admin
                    </button>
                  )}
                  {u.role === 'admin' && u._id !== String(user?.id) && (
                    <button
                        onClick={() => demoteUser(u._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                        Demote to Customer
                    </button>
                    )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
