import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTopPools } from './hooks/use-top-pools';
import { useProminentTransactions } from './hooks/use-prominent-transactions';

export const App = () => {
  const topPools = useTopPools();

  console.log('top pools:', topPools);

  const prominentTxs = useProminentTransactions({ pool: topPools[0] });

  console.log('prominent txs:', prominentTxs);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};
