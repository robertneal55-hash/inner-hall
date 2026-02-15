'use client';

import { useState } from 'react';

import LandingPage from '../components/landing-page';
import InnerHub from '../components/inner-hub';
import JournalSpace from '../components/journal-space';
import ListeningChamber from '../components/ListeningChamber';
import OceanRoom from '../components/ocean-room';

type View = 'landing' | 'hub' | 'journal' | 'sound' | 'ocean'| 'grand'

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

    onSelectOcean={() => {
      setCurrentView('ocean');
    }}

    onSelectGrand={() => {
      setCurrentView('grand');
    }}

    onSelectSound={() => setCurrentView('sound')}

    onSignOut={() => {
      setHasVisitedRoom(false);
      setCurrentView('landing');
    }}

    showListeningChamber={hasVisitedRoom}
  />
          }}
          onSelectSound={() => setCurrentView('sound')}
 {currentView === 'journal' && (
        <JournalSpace onBack={() => setCurrentView('hub')} />
      )}

      {currentView === 'sound' && (
        <ListeningChamber onBack={() => setCurrentView('hub')} />
      )}

{currentView === 'ocean' && (
  <OceanRoom onBack={() => { 
   setHasVisitedRoom(true); 
    setCurrentView('hub');
)}
/>
)}
{currentView === 'grand' && (
  <GrandCanyonRoom onBack={() => {
    setHasVisitedRoom(true);
    setCurrentView('hub');
)}
/>
)}
    </main>
  );
}
