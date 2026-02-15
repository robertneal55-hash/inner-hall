'use client';

import { useState } from 'react';

import LandingPage from '../components/landing-page';
import InnerHub from '../components/inner-hub';
import JournalSpace from '../components/journal-space';
import ListeningChamber from '../components/ListeningChamber';
import OceanRoom from '../components/ocean-room';

type View = 'landing' | 'hub' | 'journal' | 'sound' | 'ocean';

export default function Page() {
  const [currentView, setCurrentView] = useState<View>('landing');
const [hasVisitedRoom, setHasVisitedRoom] = useState(false);

  return (
    <main>
      {currentView === 'landing' && (
        <LandingPage onEnter={() => setCurrentView('hub')} />
      )}

      {currentView === 'hub' && (
        <InnerHub
          onSelectJournal={() => setCurrentView('journal')}
          onSelectSound={() => setCurrentView('sound')}
          onSelectOcean={() => {
  setHasVisitedRoom(true);
  setCurrentView('ocean');
}}

          onSignOut={() => setCurrentView('landing')}
          showListeningChamber={hasVisitedRoom}
        />
      )}

      {currentView === 'journal' && (
        <JournalSpace onBack={() => setCurrentView('hub')} />
      )}

      {currentView === 'sound' && (
        <ListeningChamber onBack={() => setCurrentView('hub')} />
      )}

      {currentView === 'ocean' && (
        <OceanRoom onBack={() => setCurrentView('hub')} />
      )}
    </main>
  );
}
