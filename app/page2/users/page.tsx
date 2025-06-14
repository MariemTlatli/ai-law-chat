// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold  ml-24">Utilisateurs</h1>
      <Link href="/page2/users/create" className="mb-4 mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        Ajouter un utilisateur
      </Link>

      <ul>
        {users.map((user) => (
          <li key={user.id} className="border p-4 mb-2 flex justify-between">
            <span>{user.email} - {user.role}</span>
            <div>
              <Link href={`/page2/users/${user.id}`} className="mr-2 text-blue-600">Modifier</Link>
              <button onClick={() => handleDelete(user.id)} className="text-red-600">
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  async function handleDelete(id: number) {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter((u) => u.id !== id));
  }
}