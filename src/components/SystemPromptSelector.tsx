'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RADIOLOGY_SYSTEM_PROMPTS, getSystemPromptByCategory } from '@/lib/radiology-utils';
import { RadiologyCategory } from '@/lib/types';

interface SystemPromptSelectorProps {
  currentPrompt: string;
  onPromptChange: (prompt: string) => void;
}

export default function SystemPromptSelector({ currentPrompt, onPromptChange }: SystemPromptSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<RadiologyCategory>('General Radiology');
  const [customPrompt, setCustomPrompt] = useState(currentPrompt);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    // Check if current prompt matches any predefined prompt
    const matchingPrompt = RADIOLOGY_SYSTEM_PROMPTS.find(p => p.prompt === currentPrompt);
    if (matchingPrompt) {
      setSelectedCategory(matchingPrompt.category);
      setIsCustom(false);
    } else {
      setIsCustom(true);
    }
    setCustomPrompt(currentPrompt);
  }, [currentPrompt]);

  const handleCategoryChange = (category: RadiologyCategory) => {
    setSelectedCategory(category);
    const systemPrompt = getSystemPromptByCategory(category);
    setCustomPrompt(systemPrompt.prompt);
    setIsCustom(false);
  };

  const handleCustomToggle = () => {
    setIsCustom(!isCustom);
    if (!isCustom) {
      // Switching to custom mode - keep current prompt
      setCustomPrompt(currentPrompt);
    } else {
      // Switching to predefined - load selected category prompt
      const systemPrompt = getSystemPromptByCategory(selectedCategory);
      setCustomPrompt(systemPrompt.prompt);
    }
  };

  const handleApply = () => {
    onPromptChange(customPrompt);
  };

  const handleReset = () => {
    const defaultPrompt = RADIOLOGY_SYSTEM_PROMPTS.find(p => p.isDefault);
    if (defaultPrompt) {
      setSelectedCategory(defaultPrompt.category);
      setCustomPrompt(defaultPrompt.prompt);
      setIsCustom(false);
      onPromptChange(defaultPrompt.prompt);
    }
  };

  const selectedPromptData = RADIOLOGY_SYSTEM_PROMPTS.find(p => p.category === selectedCategory);

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">System Prompt Configuration</CardTitle>
            <CardDescription>
              Choose a specialized radiology prompt or create a custom one
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomToggle}
              className={isCustom ? 'bg-blue-50 dark:bg-blue-950' : ''}
            >
              {isCustom ? 'Use Predefined' : 'Custom Prompt'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset to Default
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isCustom && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Radiology Specialty
              </label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RADIOLOGY_SYSTEM_PROMPTS.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.category}>
                      <div className="flex items-center space-x-2">
                        <span>{prompt.name}</span>
                        {prompt.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPromptData && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                  {selectedPromptData.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {selectedPromptData.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {selectedPromptData.category}
                </Badge>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            {isCustom ? 'Custom System Prompt' : 'Prompt Preview'}
          </label>
          <Textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            readOnly={!isCustom}
            className={`min-h-[200px] text-sm ${!isCustom ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
            placeholder={isCustom ? "Enter your custom system prompt..." : ""}
          />
          {!isCustom && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Preview only. Enable "Custom Prompt" to edit.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Characters:</span> {customPrompt.length}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setCustomPrompt(currentPrompt)}
              disabled={customPrompt === currentPrompt}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={customPrompt === currentPrompt}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Prompt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}