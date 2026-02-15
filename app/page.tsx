'use client';

import {useState} from 'react';
import LandingPage from '../components/landing-page';
import InnerHub from '../components/inner-hub';
import JournalSpace from '../components/journal-space';
import ListeningChamber from '../components/ListeningChamber';
import OceanRoom from '../components/ocean-room';



type View = 'landing' | 'hub' | 'journal' | 'sound' | 'ocean';

export default function Page() {
  const [currentView, setCurrentView] = useState<View>('landing');

  return (
    <main>
      {currentView === 'landing' && (
        <LandingPage onEnter={() => setCurrentView('hub')} />
      )}

      {currentView === 'hub' && (
        <InnerHub
          onSelectJournal={() => setCurrentView('journal')}
          onSelectSound={() => setCurrentView('sound')}
          onSelectOcean={() => setCurrentView('ocean')}
          onSignOut={() => setCurrentView('landing')}
          showListeningChamber={true}
        />
      )}

      {currentView === 'journal' && (
        <JournalSpace onExit={() => setCurrentView('hub')} />
      )}

      {currentView === 'sound' && (
        <ListeningChamber onExit={() => setCurrentView('hub')} />
      )}

      {currentView === 'ocean' && (
        <OceanRoom onExit={() => setCurrentView('hub')} />
      )}
    </main>
  );
}

