import React from 'react';
import './App.css';
import BlocklyWoblocks from './components/BlocklyWoblocks';
import { HeaderContent } from './components/HeaderContent';
import { WollokObject } from './models/WollokObject';

class AppState {
  wollokObjects: WollokObject[] = []

  addWollokObject(wo: WollokObject): void {
    
  }
}

export const AppContext = React.createContext({} as AppState)

function App() {
  // initial global state
  const appState: AppState = new AppState()

  return (
    <AppContext.Provider value={appState}>
        <HeaderContent />
        <BlocklyWoblocks />
    </AppContext.Provider>
  );
}

export default App;
