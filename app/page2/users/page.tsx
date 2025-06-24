'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

// Icônes SVG (vous pouvez aussi les importer depuis react-icons ou heroicons)
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Error loading users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during deletion');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800"> User Management</h1>
        <Link 
          href="/page2/users/create" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200"
        >
          <PlusIcon />
          <span>Add a user</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
          <p>No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold text-gray-700">
            <div className="col-span-4">Email</div>
<div className="col-span-3">Name</div>
<div className="col-span-3">Role</div>
<div className="col-span-2 text-right">Actions</div>

          </div>
          
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50 items-center">
              <div className="col-span-4 font-medium text-gray-800">{user.email}</div>
              <div className="col-span-3 text-gray-600">{user.name || '-'}</div>
              <div className="col-span-3">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role === "admin" ? "admin" : "lawyer"} 
                </span>
              </div>
              <div className="col-span-2 flex justify-end space-x-3">
                <Link 
                  href={`/page2/users/${user.id}`} 
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition"
                  title="Edit"
                >
                  <PencilIcon />
                  <span className="sr-only">Edit</span>
                </Link>
                <button 
                  onClick={() => handleDelete(user.id)} 
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition"
                  title="Delete"
                >
                  <TrashIcon />
                  <span className="sr-only">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}