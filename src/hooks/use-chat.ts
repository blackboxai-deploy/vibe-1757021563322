'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, ChatSession, ImageAttachment, RadiologyCategory } from '@/lib/types';
import { sendChatMessage } from '@/lib/api-client';
import { getDefaultSystemPrompt } from '@/lib/radiology-utils';

export function useChat() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('radiology-chat-sessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
          const lastSession = parsedSessions[parsedSessions.length - 1];
          setCurrentSession(lastSession);
          setMessages(lastSession.messages || []);
        }
      } catch (err) {
        console.error('Failed to load chat sessions:', err);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('radiology-chat-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = useCallback((systemPrompt?: string, category?: RadiologyCategory) => {
    const defaultPrompt = getDefaultSystemPrompt();
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: `New ${category || defaultPrompt.category} Session`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      systemPrompt: systemPrompt || defaultPrompt.prompt,
      category: category || defaultPrompt.category
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession);
    setMessages([]);
    setError(null);
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setMessages(session.messages || []);
      setError(null);
    }
  }, [sessions]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        const newCurrent = remainingSessions[remainingSessions.length - 1];
        setCurrentSession(newCurrent);
        setMessages(newCurrent.messages || []);
      } else {
        setCurrentSession(null);
        setMessages([]);
      }
    }
  }, [currentSession, sessions]);

  const updateSystemPrompt = useCallback((prompt: string) => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        systemPrompt: prompt,
        updatedAt: new Date()
      };
      setCurrentSession(updatedSession);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
    }
  }, [currentSession]);

  const sendMessage = useCallback(async (content: string, images?: ImageAttachment[]) => {
    if (!currentSession) {
      createNewSession();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content,
        timestamp: new Date(),
        images: images || []
      };

      // Update messages immediately with user message
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Send to AI
      const aiResponse = await sendChatMessage(
        updatedMessages,
        currentSession.systemPrompt,
        images
      );

      // Create AI response message
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Update session
      const updatedSession: ChatSession = {
        ...currentSession,
        messages: finalMessages,
        updatedAt: new Date(),
        title: currentSession.messages.length === 0 
          ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
          : currentSession.title
      };

      setCurrentSession(updatedSession);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));

    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, messages, createNewSession]);

  return {
    currentSession,
    sessions,
    messages,
    isLoading,
    error,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    updateSystemPrompt
  };
}