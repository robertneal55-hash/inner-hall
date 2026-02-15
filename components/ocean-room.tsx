'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface OceanRoomProps {
  onBack: () => void;
}

const WRITING_PROMPTS = [
  "What am I grateful for in this moment?",
  "What truth do I need to acknowledge today?",
  "What am I ready to release?",
  "What fills my heart with peace?",
  "What would I tell my younger self?",
  "What dream am I nurturing?",
  "What lesson has the ocean taught me?",
  "What do I need to forgive myself for?"
];

export default function OceanRoom({ onBack }: OceanRoomProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [writtenText, setWrittenText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    audioRef.current.play().catch(() => {});

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedPrompt && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedPrompt]);

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setWrittenText('');
  };

  const handleLayItDown = () => {
    setSelectedPrompt(null);
    setWrittenText('');
    toast({
      title: "Released",
      description: "Your words have been laid down to the ocean.",
    });
  };

  const handleSaveAndExit = async () => {
    if (!selectedPrompt) {
      onBack();
      return;
    }

    setIsSaving(true);

    const fallbackTimer = setTimeout(() => {
      console.log('Fallback navigation triggered (non-blocking)');
      setIsSaving(false);
      onBack();
    }, 2000);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Auth error (non-blocking):', userError);
        toast({
          title: "Guest Mode",
          description: "Sign in to save your reflections.",
          variant: "destructive",
        });
        clearTimeout(fallbackTimer);
        setIsSaving(false);
        onExit(false);
        return;
      }

      const { error } = await supabase
        .from('ocean_entries')
        .insert({
          user_id: user.id,
          prompt: selectedPrompt,
          content: writtenText,
        });

      if (error) {
        console.error('Database save failed (non-blocking):', error);
        throw error;
      }

      toast({
        title: "Saved",
        description: "Your reflection has been preserved.",
      });
      clearTimeout(fallbackTimer);
      setIsSaving(false);
      onExit(true);
    } catch (error) {
      console.error('Save error (non-blocking):', error);
      toast({
        title: "Error",
        description: "Unable to save. Returning to hall.",
        variant: "destructive",
      });
      clearTimeout(fallbackTimer);
      setIsSaving(false);
      onExit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pointer-events-none">
      <button
        onClick={() => onExit(false)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'white',
          color: '#374151',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textDecoration: 'none',
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Hall
      </button>

      <div className="container mx-auto px-4 py-20 max-w-4xl pointer-events-auto">
        {!selectedPrompt ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-serif text-gray-800 mb-2">Ocean Room</h1>
              <p className="text-lg text-gray-600 italic">Select a prompt to begin your reflection</p>
            </div>

            <div className="space-y-3">
              {WRITING_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptSelect(prompt)}
                  className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all font-serif text-gray-800"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-32">
            <div className="mb-6">
              <h2 className="text-2xl font-serif text-gray-800 italic text-center mb-6">
                {selectedPrompt}
              </h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-gray-200 min-h-[350px]">
              <textarea
                ref={textareaRef}
                value={writtenText}
                onChange={(e) => setWrittenText(e.target.value)}
                className="w-full h-full min-h-[320px] bg-transparent border-none outline-none resize-none font-serif text-lg text-gray-800 leading-relaxed"
                placeholder="Let your thoughts flow onto the page..."
              />
            </div>

            <div className="fixed bottom-8 left-0 right-0 z-[9999] flex gap-4 justify-center flex-wrap px-4 pointer-events-none">
              <Button
                onClick={handleLayItDown}
                variant="outline"
                className="px-8 py-6 text-lg font-serif pointer-events-auto"
                disabled={isSaving}
              >
                Lay It Down
              </Button>
              <Button
                onClick={handleSaveAndExit}
                disabled={isSaving || !writtenText.trim()}
                className="px-8 py-6 text-lg font-serif pointer-events-auto"
              >
                {isSaving ? 'Saving...' : 'Save and Exit'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
