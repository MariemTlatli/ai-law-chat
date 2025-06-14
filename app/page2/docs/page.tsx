'use client';

import { useState } from 'react';
import axios from 'axios';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export default function DocsPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Bonjour ! Pose-moi une question.' },
    { role: 'user', content: 'Bonjour ! Pose-moi une question.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Pour gérer l'indicateur de chargement
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };

    // Ajouter le message utilisateur
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Envoi via POST avec body
      const response = await axios.post('http://localhost:8000/router', { "current_query": input });
      console.log("***************response.data ******************** \n")
      console.log(response.data)
      var resp = response.data 
      console.log(resp.content)
      console.log(resp.type)


      const botMsg: Message = {
        role: 'bot',
        content: resp.content || "Aucune réponse reçue.",
      };

      // Ajouter la réponse du bot
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

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Messages messages={messages} />
      <form
  onSubmit={handleSubmit}
  className="flex flex-col mx-auto px-4 bg-background pb-4 md:pb-6 gap-4 w-full md:max-w-3xl"
>
  {/* Bloc du fichier (en haut) */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner un fichier :</label>
    <input
      type="file"
      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0
                 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
    />
    {selectedFile && (
      <p className="text-xs text-green-600 mt-1">Fichier sélectionné : {selectedFile.name}</p>
    )}
  </div>

  {/* Bloc du message (en bas) */}
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

      {isLoading && (
        <div className="text-center text-sm text-gray-500">Réception de la réponse...</div>
      )}
    </div>
  );
}

export function ChatHeader() {
  return (
    <div className="w-full px-4 py-3 border-b shadow-sm bg-white text-center">
      <h1 className="text-lg font-bold">Chat dynamique</h1>
    </div>
  );
}

type Props1 = {
  messages: Message[];
};

export function Messages({ messages }: Props1) {
  return (
    <div className="flex flex-col gap-2 p-4 max-h-[70vh] overflow-y-auto w-full md:max-w-3xl mx-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 rounded max-w-[80%] ${
            msg.role === 'user'
              ? 'bg-blue-100 self-end'
              : 'bg-gray-100 self-start'
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}

type Props = {
  input: string;
  setInput: (value: string) => void;
};

export function MultimodalInput({ input, setInput }: Props) {
  return (
    <input
      type="text"
      className="flex-1 border px-3 py-2 rounded"
      placeholder="Écris un message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}