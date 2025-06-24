// app/users/create/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateUserPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (res.ok) {
      alert('User created');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add a User</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2"
        >
          <option value="user">Lawyer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create
        </button>
        <Link href="/page2/users" className="block text-blue-600 mt-2">
          Back
        </Link>
      </form>
    </div>
  );
}