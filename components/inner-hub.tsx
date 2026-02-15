'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { BookOpen, Music, LogOut, LogIn, Waves } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface InnerHubProps {
  onSelectJournal?: () => void;
  onSelectSound?: () => void;
  onSelectOcean?: () => void;
  onSignOut?: () => void;
  showListeningChamber?: boolean;
}

export default function InnerHub({ onSelectJournal, onSelectSound, onSelectOcean, onSignOut, showListeningChamber = false }: InnerHubProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => {
        console.error('Session check failed (non-blocking):', error);
        setSession(null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('Subscription cleanup error (non-blocking):', error);
      }
    };
  }, []);

  useEffect(() => {
    const audio = new Audio('https://www.dropbox.com/scl/fi/a8s29rv18hguldsrqkdfc/burds.txt.wav?rlkey=mvjfsm28m9vmkfccsposuxspa&st=0sgg7zi4&dl=1');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
        fadeIn(audio, 0.3, 2500);
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    };

    playAudio();

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audio.pause();
      audio.src = '';
    };
  }, []);

  const fadeIn = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeIncrement = targetVolume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (currentStep >= steps) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        return;
      }
      audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);
      currentStep++;
    }, stepDuration);
  };

  const fadeOut = (audio: HTMLAudioElement, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const startVolume = audio.volume;
      const steps = 50;
      const stepDuration = duration / steps;
      const volumeDecrement = startVolume / steps;
      let currentStep = 0;

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      fadeIntervalRef.current = setInterval(() => {
        if (currentStep >= steps) {
          audio.volume = 0;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
          resolve();
          return;
        }
        audio.volume = Math.max(startVolume - volumeDecrement * currentStep, 0);
        currentStep++;
      }, stepDuration);
    });
  };

  const handlePathSelect = async (callback?: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (audioRef.current) {
      await fadeOut(audioRef.current, 1500);
    }

    callback?.();
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error (non-blocking):', error);
    } finally {
      onSignOut?.();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <img
        src="https://dl.dropboxusercontent.com/scl/fi/ral0f661aszwjabuws88o/ChatGPT-Image-Feb-1-2026-12_14_55-PM.png?rlkey=1vu39s16ez1lfjpwf7s241vhk"
        alt="Inner Hall"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      <div className="fixed inset-0 bg-black/50" style={{ zIndex: 0 }} />
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8" style={{ zIndex: 1 }}>
        <div className="max-w-2xl w-full space-y-12 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-lora font-light text-white">
              Inner Hall
            </h1>

            <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
              Every path carries a different kind of release.
            </p>

            <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed">
              There is no right choice. Only the one that feels true to you in this moment.
            </p>
          </div>

          <div className={`grid grid-cols-1 ${showListeningChamber ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 py-12`}>
            <button
              onClick={() => handlePathSelect(onSelectJournal)}
              disabled={isTransitioning}
              className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-8 hover:bg-white/20 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center gap-4">
                <BookOpen className="w-12 h-12 text-gray-200 group-hover:text-white transition-colors" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-lora font-light text-white">
                    Grand Canyon Room
                  </h2>
                  <p className="text-sm text-gray-300">
                    Write without judgment. Set it down.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handlePathSelect(onSelectOcean)}
              disabled={isTransitioning}
              className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-8 hover:bg-white/20 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center gap-4">
                <Waves className="w-12 h-12 text-gray-200 group-hover:text-white transition-colors" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-lora font-light text-white">
                    Ocean Room
                  </h2>
                  <p className="text-sm text-gray-300">
                    Reflect. Write. Release.
                  </p>
                </div>
              </div>
            </button>

            {showListeningChamber && (
              <button
                onClick={() => handlePathSelect(onSelectSound)}
                disabled={isTransitioning}
                className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-8 hover:bg-white/20 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-4">
                  <Music className="w-12 h-12 text-gray-200 group-hover:text-white transition-colors" />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-lora font-light text-white">
                      Listening Chamber
                    </h2>
                    <p className="text-sm text-gray-300">
                      Listen. Receive. Breathe.
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>

          <div className="pt-8 border-t border-white/20">
            {session ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={onSignOut}
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
