'use client';

import { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export default function DocsPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Bonjour ! Pose-moi une question.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let base64File: string | null = null;

      if (selectedFile) {
        base64File = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const cleanBase64 = result.split(',')[1]; // remove data prefix
            resolve(cleanBase64);
          };
          reader.onerror = () => reject("Erreur de lecture du fichier");
          reader.readAsDataURL(selectedFile);
        });
      }

      const response = await axios.post('http://localhost:8000/router', {
        current_query: input,
        file_path: base64File,
      });

      const botMsg: Message = {
        role: 'bot',
        content: response.data?.content || "Aucune réponse reçue.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: "Erreur lors de la récupération de la réponse." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!selectedFile) {
      sendMessage(); // envoi direct si aucun fichier
    }
    // sinon : la boîte de dialogue a déjà été ouverte via onChange
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ChatHeader />
      <Messages messages={messages} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col mx-auto px-4 pb-6 gap-4 w-full md:max-w-3xl"
      >
        {/* Sélection fichier PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sélectionner un fichier PDF :
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedFile(file);
              if (file) {
                setIsDialogOpen(true); // ouvre la boîte directement
              }
            }}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:border-0
                       file:font-semibold file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          {selectedFile && (
            <p className="text-xs text-green-600 mt-1">
              Fichier sélectionné : {selectedFile.name}
            </p>
          )}
        </div>

        {/* Zone de message + bouton */}
        <div className="flex gap-2">
          <MultimodalInput input={input} setInput={setInput} />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </form>

      {/* Indication de chargement */}
      {isLoading && (
        <div className="text-center text-sm text-gray-500 mb-4">
          Réception de la réponse...
        </div>
      )}

      {/* Boîte de confirmation */}
      <ConfirmDialog
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          setIsDialogOpen(false);
          sendMessage();
        }}
        fileName={selectedFile?.name}
      />
    </div>
  );
}

// Composant d'en-tête
function ChatHeader() {
  return (
    <div className="w-full px-4 py-3 border-b shadow-sm bg-white text-center">
      <h1 className="text-xl font-bold text-blue-700">Chat LAW</h1>
    </div>
  );
}

// Composant messages
type MessagesProps = {
  messages: Message[];
};

function Messages({ messages }: MessagesProps) {
  return (
    <div className="flex flex-col gap-2 p-4 max-h-[65vh] overflow-y-auto w-full md:max-w-3xl mx-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg shadow-sm text-sm whitespace-pre-wrap max-w-[80%] ${
            msg.role === 'user'
              ? 'bg-blue-100 self-end text-right'
              : 'bg-gray-100 self-start text-left'
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}

// Composant input message
type InputProps = {
  input: string;
  setInput: (value: string) => void;
};

function MultimodalInput({ input, setInput }: InputProps) {
  return (
    <input
      type="text"
      className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Écris une question liée au fichier..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}

// Boîte de confirmation
type ConfirmDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  fileName?: string;
};

function ConfirmDialog({ open, onCancel, onConfirm, fileName }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Confirmer l'envoi</DialogTitle>
          <DialogDescription>
            Vous avez sélectionné le fichier : <strong>{fileName}</strong>.
            <br />
            Voulez-vous vraiment l’envoyer avec votre question ?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirmer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
