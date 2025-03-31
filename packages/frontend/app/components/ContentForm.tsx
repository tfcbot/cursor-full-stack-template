'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentRequest, useGenerateContent } from '../api';

export function ContentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ContentRequest>({
    topic: '',
    length: 'medium',
    tone: 'professional'
  });
  
  const { mutate, isPending, isError, error } = useGenerateContent();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate(formData, {
      onSuccess: (data) => {
        router.push(`/content/${data.id}`);
      }
    });
  };
  
  return (
    <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border">
      <h1 className="text-2xl font-bold mb-6 text-fg-primary">Generate Content</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-fg-secondary mb-1">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            placeholder="Enter a topic for content generation"
            className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-fg-primary placeholder-fg-tertiary"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-fg-secondary mb-1">
              Length
            </label>
            <select
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-fg-primary"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-fg-secondary mb-1">
              Tone
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-fg-primary"
            >
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>
        </div>
        
        {isError && (
          <div className="text-error text-sm">
            Error: {error instanceof Error ? error.message : 'Something went wrong'}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 px-4 bg-accent-primary text-fg-primary rounded-md font-medium ${
            isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
        >
          {isPending ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
    </div>
  );
} 