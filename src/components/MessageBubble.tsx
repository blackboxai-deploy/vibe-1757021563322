'use client';

import { Message } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MessageBubbleProps {
  message: Message;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const timestamp = formatTimeAgo(message.timestamp);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl ${isUser ? 'ml-12' : 'mr-12'}`}>
        <div className="flex items-center mb-2 space-x-2">
          {!isUser && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">AI</span>
            </div>
          )}
          <Badge variant={isUser ? 'default' : 'secondary'} className="text-xs">
            {isUser ? 'You' : 'AI Assistant'}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {timestamp}
          </span>
          {isUser && (
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
          )}
        </div>

        <Card className={`${
          isUser 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}>
          <CardContent className="p-4">
            {/* Images */}
            {message.images && message.images.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium opacity-90">
                  📷 {message.images.length} image{message.images.length > 1 ? 's' : ''} attached:
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-md">
                  {message.images.map((image, index) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.preview}
                        alt={`Medical image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-white/20"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {image.type.split('/')[1]?.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Content */}
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') {
                  return <br key={index} />;
                }
                
                // Format structured content
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h4 key={index} className={`font-semibold mt-4 mb-2 ${
                      isUser ? 'text-blue-100' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {paragraph.slice(2, -2)}
                    </h4>
                  );
                }
                
                // Format bullet points
                if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
                  return (
                    <li key={index} className={`ml-4 mb-1 ${
                      isUser ? 'text-blue-50' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {paragraph.slice(1).trim()}
                    </li>
                  );
                }
                
                // Regular paragraph
                return (
                  <p key={index} className={`mb-2 leading-relaxed ${
                    isUser ? 'text-blue-50' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* AI Response Metadata */}
            {!isUser && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>🤖</span>
                    <span>Claude 3.5 Sonnet</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Radiology AI Assistant
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}