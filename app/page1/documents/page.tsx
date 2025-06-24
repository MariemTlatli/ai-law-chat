'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type DocumentType = {
  _id: string;
  title: string;
  content: string; // Contiendra le Base64 du PDF
  createdAt: string;
};

export default function DocsPage() {
  const [docs, setDocs] = useState<DocumentType[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      setLoading(true);
      const res = await axios.get('/api/docs');
      setDocs(res.data);
    } catch (error) {
      alert('Error loading documents');
    } finally {
      setLoading(false);
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setContent(base64); // On stocke directement le Base64 dans le content
      } catch (error) {
        console.error("Erreur de conversion Base64 :", error);
        alert("Error reading the file");
        setSelectedFile(null);
      }
    } else {
      setContent('');
    }
  };

  async function handleAddOrUpdate(e: React.FormEvent) {
    e.preventDefault();
   
    if (!title) return alert('Title is required');
if (!content) return alert('No file selected');

    try {
      setLoading(true);

      const documentData = {
        title,
        content // Ici content contient déjà le Base64 du PDF
      };

      if (editingId) {
        await axios.put(`/api/docs/${editingId}`, documentData);
        setEditingId(null);
      } else {
        await axios.post('/api/docs', documentData);
      }

      resetForm();
      fetchDocs();
    } catch (error) {
      alert('Error');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle('');
    setContent('');
    setSelectedFile(null);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async function handleDelete(id: string) {
if (!confirm('Delete this document?')) return;
    try {
      setLoading(true);
      await axios.delete(`/api/docs/${id}`);
      fetchDocs();
    } catch (error) {
      alert('Erreur deleting');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(doc: DocumentType) {
    setEditingId(doc._id);
    setTitle(doc.title);
    setContent(doc.content);
    setSelectedFile(new File([], doc.title + '.pdf')); 
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  function displayPdfButton(doc: DocumentType) {
    if (!doc.content) return null;

    return (
      <div className="mt-2">
        <a 
          href={doc.content} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          
           <div className="mt-2 flex gap-2">
                  <Link 
                    href={`/page1/documents/${doc._id}`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                  <a 
                    href={doc.content} 
                    download={`${doc.title}.pdf`}
                    className="text-green-600 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
        </a>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Management of Documents </h1>

      <form onSubmit={handleAddOrUpdate} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Title of document*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        
        {/* Input fichier PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
{editingId ? 'Replace the PDF file*' : 'Select a PDF file*'}          </label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:border-0
                     file:font-semibold file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
            required={!editingId}
          />
          {selectedFile && (
            <p className="text-xs text-green-600 mt-1">
               Selected file: {selectedFile.name}
            </p>
          )}
          {editingId && !selectedFile && (
            <p className="text-xs text-gray-500 mt-1">
 The existing PDF will be kept if no new file is selected.
             </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
{editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && !editingId && <p>Loading...</p>}

      <ul className="space-y-3">
        {docs.length === 0 && !loading && <li className="text-gray-500">No document found</li>}
        {docs.map((doc) => (
          <li
            key={doc._id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{doc.title}</h3>
                {displayPdfButton(doc)}
                <small className="text-gray-500 block mt-2">
                  Créé le : {new Date(doc.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => startEdit(doc)}
                  className="bg-yellow-400 px-3 py-1 rounded flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}