
import React, { useState, useCallback } from 'react';
import { Message } from './types';
import { sendMessageToGemini } from './services/geminiService';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
      { id: 'initial-message', role: 'model', text: 'Hello! How can I assist you today?' }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text);
      const modelMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, something went wrong. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans text-slate-200">
      <Header />
      <main className="flex-1 flex flex-col min-h-0 bg-slate-900">
        <div className="flex-1 overflow-hidden">
            <div className="h-full max-w-4xl mx-auto flex flex-col">
                 <MessageList messages={messages} isLoading={isLoading} />
            </div>
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;
