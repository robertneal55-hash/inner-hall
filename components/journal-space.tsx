ault'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Image from 'next/image';

interface JournalSpaceProps {
  onBack?: (completed?: boolean) => void;
}

export default function JournalSpace({ onBack }: JournalSpaceProps) {
  const [step, setStep] = useState<'overview' | 'lectern'>('overview');
  const [mode, setMode] = useState<'initial' | 'writing'>('initial');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === 'writing' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  const handleApproachLectern = () => {
    setStep('lectern');
  };

  const handleEnter = () => {
    setMode('writing');
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('The page is empty');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No user session (non-blocking)');
        toast.error('Unable to save - no user session');
        return;
      }

      const { error } = await supabase.from('journal_entries').insert([
        {
          content: content.trim(),
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error('Database save failed (non-blocking):', error);
        throw error;
      }

      toast.success('Your words have been preserved');
      setContent('');
      setMode('initial');
      setStep('overview');
      onBack?.(true);
    } catch (error) {
      console.error('Save error (non-blocking):', error);
      toast.error('Unable to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExit = () => {
    if (content.trim() && mode === 'writing') {
      const confirmed = window.confirm('Your words have not been saved. Leave anyway?');
      if (!confirmed) return;
    }
    setContent('');
    setMode('initial');
    setStep('overview');
    onBack?.(false);
  };

  if (step === 'overview') {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/chatgpt_image_feb_1,_2026,_11_26_05_am.png"
            alt="Grand Canyon Room Overview"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
          <h1 className="text-5xl md:text-6xl font-lora font-light text-white text-center drop-shadow-lg">
            Grand Canyon Room
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-200 text-center max-w-2xl drop-shadow-lg">
            A place to write without judgment. Set it down.
          </p>
          <button
            onClick={handleApproachLectern}
            className="px-12 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-lg text-white font-medium text-lg tracking-wide transition-all shadow-lg hover:shadow-xl"
          >
            Approach the Lectern
          </button>
          <button
            onClick={handleExit}
            className="px-8 py-2 text-white/80 hover:text-white transition-colors"
          >
            Return to Inner Hall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/chatgpt_image_feb_1,_2026,_12_49_01_pm.png"
          alt="Lectern Close-up"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen w-full px-4 py-16">
        <div className="relative w-full max-w-2xl">
          <div
            className="relative bg-amber-50/95 backdrop-blur-sm rounded-sm shadow-2xl border-4 border-amber-900/40 p-12"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #fef3c7 0%, #fde68a 100%)',
            }}
          >
            {mode === 'initial' && (
              <div className="space-y-8">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <div className="text-sm text-amber-900/60 tracking-widest uppercase">
                      Username
                    </div>
                    <div className="text-sm text-amber-900/60 tracking-widest uppercase">
                      Password
                    </div>
                  </div>

                  <div className="h-px bg-amber-900/20"></div>

                  <p className="text-xs text-amber-900/50 italic max-w-md mx-auto">
                    Begin when ready.
                  </p>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={handleEnter}
                    className="px-8 py-3 bg-amber-900/20 hover:bg-amber-900/30 border-2 border-amber-900/40 rounded text-amber-900 font-medium tracking-wide transition-colors"
                  >
                    Enter
                  </button>
                  <button
                    onClick={handleExit}
                    className="px-8 py-3 bg-amber-900/10 hover:bg-amber-900/20 border-2 border-amber-900/30 rounded text-amber-900/70 font-medium tracking-wide transition-colors"
                  >
                    Save & Exit
                  </button>
                </div>
              </div>
            )}

            {mode === 'writing' && (
              <div className="space-y-6">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 bg-transparent border-none outline-none resize-none text-amber-950 leading-relaxed text-base font-serif placeholder:text-amber-900/30"
                  placeholder="The book awaits your words..."
                  style={{
                    caretColor: '#78350f',
                  }}
                />

                <div className="flex gap-4 justify-center pt-4 border-t-2 border-amber-900/20">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-amber-900/20 hover:bg-amber-900/30 border-2 border-amber-900/40 rounded text-amber-900 font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleExit}
                    disabled={isSaving}
                    className="px-8 py-3 bg-amber-900/10 hover:bg-amber-900/20 border-2 border-amber-900/30 rounded text-amber-900/70 font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Exit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
