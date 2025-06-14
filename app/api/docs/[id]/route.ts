import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Document from '@/models/document';

// 🧠 Mettez à jour un document
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, content } = await req.json();

  await connectToDatabase();

  try {
    const updated = await Document.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!updated) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 400 });
  }
}

// 🧠 Supprimer un document
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  await connectToDatabase();

  try {
    const deleted = await Document.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    return NextResponse.json({ message: 'Document supprimé' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 400 });
  }
}
