'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import SystemPromptSelector from './SystemPromptSelector';
import { useChat } from '@/hooks/use-chat';
import { ImageAttachment } from '@/lib/types';

interface ChatInterfaceProps {
  className?: string;
}

export default function ChatInterface({ className }: ChatInterfaceProps) {
  const {
    currentSession,
    messages,
    isLoading,
    error,
    sendMessage,
    createNewSession,
    updateSystemPrompt
  } = useChat();
  
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Create initial session if none exists
  useEffect(() => {
    if (!currentSession) {
      createNewSession();
    }
  }, [currentSession, createNewSession]);

  const handleSendMessage = async (content: string, images?: ImageAttachment[]) => {
    if (!content.trim() && (!images || images.length === 0)) return;
    await sendMessage(content, images);
  };

  const handleSystemPromptChange = (prompt: string) => {
    updateSystemPrompt(prompt);
    setShowSystemPrompt(false);
  };

  const handleNewChat = () => {
    createNewSession();
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {currentSession?.title || 'AI Radiology Chat'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentSession?.category || 'General Radiology'} • {messages.length} messages
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                className="px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                System Prompt
              </button>
              <button
                onClick={handleNewChat}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                New Chat
              </button>
            </div>
          </div>
        </div>

        {/* System Prompt Selector */}
        {showSystemPrompt && (
          <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
            <SystemPromptSelector
              currentPrompt={currentSession?.systemPrompt || ''}
              onPromptChange={handleSystemPromptChange}
            />
          </div>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white text-2xl">🩻</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Welcome to AI Radiology Chat
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        Your professional AI assistant for medical imaging interpretation and radiology consultation.
                      </p>
                      <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                        <p>• Upload medical images for multimodal analysis</p>
                        <p>• Ask questions about imaging findings</p>
                        <p>• Get structured differential diagnoses</p>
                        <p>• Customize system prompts for different specialties</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Typing Indicator */}
            {isLoading && <TypingIndicator />}

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                    <span>⚠️</span>
                    <span className="font-medium">Error:</span>
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Medical Disclaimer */}
        <div className="flex-shrink-0 px-6 py-2 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-300 text-center">
            ⚠️ AI assistance for educational/consultation only. Verify with qualified radiologists. Not a replacement for professional medical judgment.
          </p>
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Describe your case, ask about imaging findings, or upload medical images for analysis..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}