import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Document from '@/models/document';

// GET /api/docs
export async function GET() {
  await connectToDatabase();

  // find() pour récupérer tous les documents, triés par createdAt décroissant
  const docs = await Document.find().sort({ createdAt: -1 });

  return NextResponse.json(docs);
}

// POST /api/docs
export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
  }

  await connectToDatabase();

  // Création d'un nouveau document
  const doc = new Document({ title, content });
  await doc.save();

  return NextResponse.json(doc, { status: 201 });
}
