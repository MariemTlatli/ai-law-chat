'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type DocumentType = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function DocsPage() {
  const [docs, setDocs] = useState<DocumentType[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      setLoading(true);
      const res = await axios.get('/api/docs');
      setDocs(res.data);
    } catch (error) {
      alert('Erreur chargement des documents');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return alert('Remplissez tous les champs');

    try {
      setLoading(true);

      if (editingId) {
        await axios.put(`/api/docs/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        await axios.post('/api/docs', { title, content });
      }

      setTitle('');
      setContent('');
      fetchDocs();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce document ?')) return;
    try {
      setLoading(true);
      await axios.delete(`/api/docs/${id}`);
      fetchDocs();
    } catch (error) {
      alert('Erreur suppression');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(doc: DocumentType) {
    setEditingId(doc._id);
    setTitle(doc.title);
    setContent(doc.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setContent('');
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD Documents</h1>

      <form onSubmit={handleAddOrUpdate} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full rounded h-24"
        />
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            {editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading && <p>Chargement...</p>}

      <ul>
        {docs.length === 0 && !loading && <li>Aucun document trouvé.</li>}
        {docs.map((doc) => (
          <li
            key={doc._id}
            className="border p-4 mb-3 rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="whitespace-pre-wrap">{doc.content}</p>
              <small className="text-gray-500">
                Créé le : {new Date(doc.createdAt).toLocaleString()}
              </small>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => startEdit(doc)}
                className="bg-yellow-400 px-2 py-1 rounded"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(doc._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
