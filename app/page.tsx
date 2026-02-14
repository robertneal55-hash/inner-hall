'use client';

import { useState } from 'react';
import { AuthProvider } from '@/components/auth-context';
import { LandingPage } from '@/components/landing-page';
import { InnerHub } from '@/components/inner-hub';
import { JournalSpace } from '@/components/journal-space';
import { SoundSpace } from '@/components/sound-space';
import { OceanRoom } from '@/components/ocean-room';
import { Toaster } from '@/components/ui/sonner';
import { NetworkBlocker } from './network-blocker';

type View = 'landing' | 'hub' | 'journal' | 'sound' | 'ocean';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [hasVisitedRoom, setHasVisitedRoom] = useState(false);

  const handleReturnFromJournal = () => {
    setHasVisitedRoom(true);
    setCurrentView('hub');
  };

  const handleReturnFromOcean = () => {
      setHasVisitedRoom(true);
    setCurrentView('hub');
  };

  return (
    <AuthProvider>
      <NetworkBlocker />
      <main>
        {currentView === 'landing' && (
          <LandingPage onEnter={() => setCurrentView('hub')} />
        )}
  {currentView === 'hub' && (
  <InnerHub
    onSelectJournal={() => {
      console.log('GO JOURNAL');
      setCurrentView('journal');
    }}
    onSelectSound={() => {
      console.log('GO SOUND');
      setCurrentView('sound');
    }}
    onSelectOcean={() => {
      console.log('GO OCEAN');
      setCurrentView('ocean');
    }}
    onSignOut={() => setCurrentView('landing')}
    showListeningChamber={true}
)}
        {currentView === 'journal' && (
          <JournalSpace onBack={handleReturnFromJournal} />
        )}

        {currentView === 'sound' && (
          <SoundSpace onBack={() => setCurrentView('hub')} />
        )}

        {currentView === 'ocean' && (
          <OceanRoom onExit={handleReturnFromOcean} />
        )}
      </main>
      <Toaster />
    </AuthProvider>
  );
}
