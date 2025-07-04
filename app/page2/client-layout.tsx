'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { MenuIcon, XIcon } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  session: any; // tu peux typer si tu as un type de session
}

export default function ClientLayout({ children, session }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-800">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        {isSidebarOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {isSidebarOpen && <Sidebar session={session} />}
      <main className="flex-1 bg-white p-4">{children}</main>
    </div>
  );
}
