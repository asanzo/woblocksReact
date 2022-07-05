import React, { useState } from 'react';
import './App.css';
import BlocklyWorkspace from './components/BlocklyWorkspace';
import { HeaderContent } from './components/HeaderContent';

export class AppState {
  readonly wollokObjects: string[] = ["pepita", "pepona", "fireRing"]

  fireStateChange: ()=>void = ()=>{} //to be overriden later

  addWollokObject(wObject: string) {
    this.wollokObjects.push(wObject)
    this.fireStateChange()
  }
}

function App() {
  const [appState, setAppState] = useState(new AppState())

  appState.fireStateChange = () => setAppState(appState)

  return (
    <div className="App">
      <header>
        <HeaderContent appState={appState}/>
        <BlocklyWorkspace />
      </header>
    </div>
  );
}

export default App;
