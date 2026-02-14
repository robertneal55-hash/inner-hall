'use client';

import LandingPage from '../components/LandingPage';
import InnerHub from '../components/InnerHub';
import JournalSpace from '../components/JournalSpace';
import ListeningChamber from '../components/ListeningChamber';
import OceanRoom from '../components/OceanRoom';



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

