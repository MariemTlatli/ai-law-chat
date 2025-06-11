'use client';

import { auth } from '@/lib/auth';
import { useState } from 'react';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export default function DocsPage() {

  //  const session = await auth();

  // if (!session?.user || session.user.role !== "admin") {
  //   return <div>Access Denied</div>;
  // }
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Bonjour ! Pose-moi une question.' },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    const botMsg: Message = { role: 'bot', content: "Merci pour ton message !" };

    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Messages messages={messages} />
      <form
        onSubmit={handleSubmit}
        className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
      >
        <MultimodalInput input={input} setInput={setInput} />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

export function ChatHeader() {
  return (
    <div className="w-full px-4 py-3 border-b shadow-sm bg-white text-center">
      <h1 className="text-lg font-bold">Chat statique</h1>
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
