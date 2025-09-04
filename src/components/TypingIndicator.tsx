'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-3xl mr-12">
        <div className="flex items-center mb-2 space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            AI Assistant
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            typing...
          </span>
        </div>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                AI is analyzing your request...
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}