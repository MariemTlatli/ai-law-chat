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

// TYPES
type Message = {
  role: 'user' | 'bot';
  content: string;
};

type ProcessStatus = {
  processing: boolean;
  message: string;
  isError: boolean;
};

// PAGE PRINCIPALE
export default function DocsPage() {
  // États pour le chat
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Bonjour ! Pose-moi une question.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour le fichier PDF
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // État pour le traitement PDF
  const [processStatus, setProcessStatus] = useState<ProcessStatus>({
    processing: false,
    message: '',
    isError: false
  });

  // Conversion du fichier en base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = () => reject("Erreur de lecture du fichier");
      reader.readAsDataURL(file);
    });
  };

  // Traitement du PDF via votre API
  const processPDF = async (fileBase64: string, fileName: string) => {
    setProcessStatus({
      processing: true,
      message: 'Traitement du PDF en cours...',
      isError: false,
    });
    setIsDialogOpen(false);

    try {
    const response = await axios.post('http://localhost:8000/process-pdf/', {
        base64_pdf: fileBase64,
        filename: fileName,
        metadata: {  
          source: fileName,
          uploaded_at: new Date().toISOString()
        }
      });

      setProcessStatus({
        processing: false,
        message: 'PDF traité avec succès! Le graphe a été mis à jour.',
        isError: false,
      });

      return response.data;
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
      setProcessStatus({
        processing: false,
        message: `Erreur: `,
        isError: true,
      });
      throw error;
    }
  };

  // Envoi du message avec ou sans fichier
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
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
      setIsDialogOpen(false);
    }
  };

  // Gestion du changement de fichier
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setBase64File(base64);
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Erreur de conversion Base64 :", error);
        setProcessStatus({
          processing: false,
          message: "Erreur lors de la lecture du fichier",
          isError: true,
        });
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      sendMessage();
    }
  };

  // Gestion des actions du dialogue
  const handleCancel = async () => {
    if (base64File && selectedFile) {
      await processPDF(base64File, selectedFile.name);
    } else {
      setIsDialogOpen(false);
    }
  };

  const handleConfirm = async () => {
    try {
      if (!base64File || !selectedFile) return;

      const response = await axios.post('/api/docs', {
        title: selectedFile.name,
        content: base64File,
      });

      console.log("Fichier envoyé avec succès :", response.data);
      sendMessage();
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier :", error);
      setProcessStatus({
        processing: false,
        message: "Erreur lors de l'envoi du fichier",
        isError: true,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="w-full px-4 py-3 border-b shadow-sm bg-white text-center">
        <h1 className="text-xl font-bold text-blue-700">Chat LAW</h1>
      </div>

      {/* Messages */}
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

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mx-auto px-4 pb-6 gap-4 w-full md:max-w-3xl"
      >
        {/* Input fichier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sélectionner un fichier PDF :
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
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

        {/* Input texte et bouton */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Écris une question liée au fichier..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </form>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="text-center text-sm text-gray-500 mb-4">
          Réception de la réponse...
        </div>
      )}

      {/* Dialogue de confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={(v) => !v && setIsDialogOpen(v)}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Confirmer l'action</DialogTitle>
            <DialogDescription>
              Vous avez sélectionné : <strong>{selectedFile?.name}</strong>.<br />
              Que souhaitez-vous faire avec ce fichier ?
            </DialogDescription>
          </DialogHeader>
          
          {processStatus.processing && (
            <div className="p-2 bg-blue-50 text-blue-800 rounded text-sm">
              {processStatus.message}
            </div>
          )}

          <div className="flex justify-between gap-2 mt-4">
            <button
              onClick={handleCancel}
              disabled={processStatus.processing}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {processStatus.processing ? 'Traitement...' : 'Traiter seulement'}
            </button>
            <button
              onClick={handleConfirm}
              disabled={processStatus.processing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Envoyer avec question
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification de statut */}
      {processStatus.message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
          processStatus.isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {processStatus.message}
        </div>
      )}
    </div>
  );
}