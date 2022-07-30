import { Network } from './curve.constants';

export const getLogoURLForToken = ({
  network,
  tokenAddress,
}: {
  network: Network;
  tokenAddress: string;
}) => {
  // Examples:
  // https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0x6b175474e89094c44da98b954eedeac495271d0f.png
  // https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets-fantom/0x04068da6c83afcfa0e13ba15a6696662335d5b75.png

  const assetsFolder = network === 'ethereum' ? 'assets' : `assets-${network}`;
  return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/${assetsFolder}/${tokenAddress.toLowerCase()}.png`;
};
