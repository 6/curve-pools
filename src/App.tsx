import React, { useMemo } from 'react';
import logo from './logo.svg';
import './App.css';
import { getTopPoolTxs } from './processed-data/txs';

function App() {
  const topStethTxs = useMemo(() => {
    return getTopPoolTxs({
      network: 'ethereum',
      contractAddress: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    });
  }, []);

  console.log('top stETH txs:', topStethTxs);

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
}

export default App;
