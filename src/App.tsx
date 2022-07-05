import React from 'react';
import './App.css';
import BlocklyWorkspace from './components/BlocklyWorkspace';
import { HeaderContent } from './components/HeaderContent';

function App() {
  return (
    <div className="App">
      <header>
        <HeaderContent />
        <BlocklyWorkspace />
      </header>
    </div>
  );
}

export default App;
