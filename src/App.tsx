import React, { useMemo } from 'react';
import logo from './logo.svg';
import './App.css';
import { getProminentTxs } from './processed-data/txs';
import { useTopPools } from './hooks/use-top-pools';

function App() {
  const topStethTxs = useMemo(() => {
    return getProminentTxs({
      network: 'ethereum',
      contractAddress: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    });
  }, []);

  console.log('top stETH txs:', topStethTxs);

  const topPools = useTopPools();

  console.log('top pools:', topPools);

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
