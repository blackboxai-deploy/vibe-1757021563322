'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageAttachment } from '@/lib/types';
import { validateImageFile, convertFileToBase64, createImagePreviewUrl } from '@/lib/radiology-utils';

interface ChatInputProps {
  onSendMessage: (content: string, images?: ImageAttachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, disabled = false, placeholder }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if ((!input.trim() && images.length === 0) || disabled) return;
    
    onSendMessage(input.trim(), images.length > 0 ? images : undefined);
    setInput('');
    setImages([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const newImages: ImageAttachment[] = [];
      
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(`File ${file.name}: ${validation.error}`);
          continue;
        }

        const base64 = await convertFileToBase64(file);
        const preview = createImagePreviewUrl(file);
        
        const imageAttachment: ImageAttachment = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file: file,
          base64,
          preview,
          type: file.type
        };
        
        newImages.push(imageAttachment);
      }
      
      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload one or more images. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Clean up preview URL to prevent memory leaks
      const removedImage = prev.find(img => img.id === imageId);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updated;
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="space-y-3">
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image) => (
            <Card key={image.id} className="relative">
              <CardContent className="p-2">
                <div className="relative group">
                  <img
                    src={image.preview}
                    alt="Medical image preview"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                    disabled={disabled}
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5 rounded-b-md">
                    {image.type.split('/')[1]?.toUpperCase()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {isUploading && (
            <Card className="w-16 h-20">
              <CardContent className="p-2 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="flex space-x-3">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Ask about imaging findings, upload medical images, or describe your case..."}
            disabled={disabled}
            className="min-h-[50px] max-h-[120px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ height: '50px' }}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          {/* Image Upload Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="px-3 py-2 h-auto"
          >
            {isUploading ? (
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            ) : (
              '📷'
            )}
          </Button>
          
          {/* Send Button */}
          <Button
            onClick={handleSubmit}
            disabled={disabled || (!input.trim() && images.length === 0)}
            className="px-6 py-2 h-auto bg-blue-600 hover:bg-blue-700"
          >
            Send
          </Button>
        </div>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/tiff"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Upload Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-4">
          <span>📷 Upload medical images (JPEG, PNG, WebP, TIFF)</span>
          <Badge variant="secondary" className="text-xs">
            Max 10MB per image
          </Badge>
        </div>
        <div className="text-slate-400 dark:text-slate-500">
          Press Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}