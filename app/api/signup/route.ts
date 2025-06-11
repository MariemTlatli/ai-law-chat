// app/api/signup/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "user", // rôle par défaut
    },
  });

  return NextResponse.json({ message: "Inscription réussie", user }, { status: 201 });
}