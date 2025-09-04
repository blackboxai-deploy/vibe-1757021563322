'use client';

import Link from 'next/link';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      AI Radiology Chat
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Professional Imaging Assistant
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/cases">
                <Button variant="outline" size="sm">
                  Cases
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 flex min-h-0">
        <div className="w-full">
          <ChatInterface className="h-full" />
        </div>
      </main>
    </div>
  );
}