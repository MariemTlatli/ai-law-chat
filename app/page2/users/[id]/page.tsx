// app/users/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type User = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

export default function EditUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/users/${id}`).then((res) => res.json()).then(setUser);
  }, [id]);

  if (!user) return <p>Chargement...</p>;

  return (
    <EditUserForm user={user} />
  );
}

function EditUserForm({ user }: { user: User }) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user.name || '');
  const [role, setRole] = useState(user.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (res.ok) {
      alert('Utilisateur mis à jour');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h1>
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
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}