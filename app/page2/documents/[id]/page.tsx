'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type DocumentType = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function DocumentDetail({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState('800px');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/api/docs/${params.id}`);
        setDoc(res.data);
      } catch (error) {
        console.error('Erreur chargement du document');
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();

    // Ajuster la hauteur de l'iframe
    const handleResize = () => {
      setIframeHeight(`${window.innerHeight - 200}px`);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-red-500">Document non trouvé</p>
        <Link href="/docs" className="text-blue-600 hover:underline mt-4 inline-block">
  Back to list
          </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        <div className="flex gap-2">
          
          <Link 
            href="/page2/documents"
            className="bg-gray-500 text-white px-3 py-1 rounded flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">
            Created on:  {new Date(doc.createdAt).toLocaleString()}
          </span>
          <a 
            href={doc.content} 
            download={`${doc.title}.pdf`}
            className="text-green-600 hover:underline flex items-center gap-1 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
  Download PDF
            </a>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <iframe 
            src={doc.content} 
            width="100%" 
            height={iframeHeight}
            style={{ border: 'none' }}
            title={`PDF - ${doc.title}`}
          >
<p>Your browser does not support PDFs. You can <a href={doc.content}>download it</a> instead.</p>          </iframe>
        </div>
      </div>
    </div>
  );
}