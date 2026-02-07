'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth-context';
import { toast } from 'sonner';
import Image from 'next/image';
import { ThresholdTransition } from '@/components/threshold-transition';

interface LandingPageProps {
  onEnter?: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleDoorwayClick = () => {
    setShowAuthForm(true);
  };

  const handleGuestEnter = () => {
    setIsTransitioning(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Welcome.');
      } else {
        await signIn(email, password);
        toast.success('Welcome.');
      }
      setIsTransitioning(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to enter');
      setIsLoading(false);
    }
  };

  const handleTransitionComplete = () => {
    setIsLoading(false);
    setIsTransitioning(false);
    onEnter?.();
  };

  return (
    <>
      <div
        className={`relative min-h-screen flex items-center justify-center transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/door_entry.jpeg"
            alt="Stone Doorway"
            fill
            className="object-cover"
            priority
          />
        </div>

        {!showAuthForm ? (
          <div className="relative z-10 flex flex-col items-center gap-6">
            <button
              onClick={handleDoorwayClick}
              className="group cursor-pointer"
              aria-label="Enter through doorway"
            >
              <div className="absolute inset-0 -inset-x-32 -inset-y-48" />
              <p className="text-white/80 text-lg tracking-wide font-light group-hover:text-white transition-colors">
                Step forward to enter.
              </p>
            </button>

            <button
              onClick={handleGuestEnter}
              className="text-white/60 text-sm tracking-wide font-light hover:text-white/90 transition-colors underline underline-offset-4"
            >
              Continue as Guest
            </button>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-sm mx-4">
            <div className="bg-black/70 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-amber-900/30">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    disabled={isLoading}
                    required
                    className="bg-white/5 border-amber-900/30 text-white placeholder:text-white/40 focus:border-amber-700/50 focus:ring-amber-700/30"
                  />
                </div>

                <div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={isLoading}
                    required
                    className="bg-white/5 border-amber-900/30 text-white placeholder:text-white/40 focus:border-amber-700/50 focus:ring-amber-700/30"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-900/30 hover:bg-amber-900/40 text-white border border-amber-900/50 backdrop-blur-sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Entering...' : 'Enter'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-white/60 hover:text-white/90 transition-colors"
                    disabled={isLoading}
                  >
                    {isSignUp ? 'Already have access' : 'Create account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <ThresholdTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />
    </>
  );
}
