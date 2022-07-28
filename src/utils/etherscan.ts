import fetch from 'isomorphic-fetch';
import { getEnv } from './env';

interface EtherscanParsedResponse<T> {
  error?: string;
  result: T;
}

// *scan (Etherscan.io family) of explorers:
// https://info.etherscan.com/api-return-errors/
interface EtherscanApiResponse<T> {
  // 1 = OK, 0 = NOT OK
  status: '1' | '0';
  message: string | void;
  // string/array/object
  result: T;
}
interface EtherscanTx {
  blockNumber: string; // '15228518';
  timeStamp: string; // '1658978522';
  hash: string; //'0x529cc7d08a1eb67870cb375997f9c60de8f0a283b1152fc6dd8a53e03d4c6e06';
  nonce: string; //'33';
  blockHash: string; // '0x5122959b06dd0be70c8d548e4ea6b4cafb30be6174558a84ad6f43533486c001';
  transactionIndex: string; // '100';
  from: string; //'0x975f1dd43f8df6cd61ccca2224fb4ae205ad0b06';
  to: string; // '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7';
  value: string; // '0';
  gas: string; // '196673';
  gasPrice: string; // '23860296028';
  isError: string; //'0';
  txreceipt_status: string; //'1';
  input: string; //'0x3df0212400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006092540000000000000000000000000000000000000000000000000000000000607bc7ee';
  contractAddress: string; // '';
  cumulativeGasUsed: string; // '8099602';
  gasUsed: string; // '136993';
  confirmations: string; // '47';
  methodId: string; // '0x3df02124';
  functionName: string; // 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy)';
}
export type EtherscanTxListResult = Array<EtherscanTx>;

export type EtherscanABIResult = Record<string, unknown>;

type EtherscanProps = { baseURL: string; apiURL: string; apiKey: string };
export class Etherscan {
  baseURL: string;
  apiURL: string;
  apiKey: string;

  constructor({ baseURL, apiURL, apiKey }: EtherscanProps) {
    this.baseURL = baseURL;
    this.apiURL = apiURL;
    this.apiKey = apiKey;
  }

  getAddressURL(address: string): string {
    return `${this.baseURL}/address/${address}`;
  }

  getBlockURL(block: number): string {
    return `${this.baseURL}/block/${block}`;
  }

  getTokenURL(tokenAddress: string): string {
    return `${this.baseURL}/token/${tokenAddress}`;
  }

  getTransactionURL(transactionHash: string): string {
    return `${this.baseURL}/tx/${transactionHash}`;
  }

  // see docs on different ABI formats:
  // https://docs.ethers.io/v5/api/utils/abi/formats/#abi-formats
  // Etherscan returns "Solidity JSON ABI"
  //
  // NOTE: if unverified, will fail with:
  // {
  //   status: '0',
  //   message: 'NOTOK',
  //   result: 'Contract source code not verified'
  // }
  async fetchABI({
    contractAddress,
  }: {
    contractAddress: string;
  }): Promise<EtherscanABIResult | void> {
    const { error, result } = await this.apiFetch<string>({
      module: 'contract',
      action: 'getabi',
      address: contractAddress,
    });
    if (error && result === 'Contract source code not verified') {
      return;
    } else if (error) {
      throw new Error(`Etherscan#fetchABI unhandled error: ${error}`);
    }
    return JSON.parse(result);
  }

  async fetchTxList({
    contractAddress,
    page = 1,
    offset = 1000,
    sort = 'desc',
  }: {
    contractAddress: string;
    page?: number;
    offset?: number;
    sort?: 'asc' | 'desc';
  }): Promise<EtherscanTxListResult> {
    // https://api.etherscan.io/api?module=account&action=txlist&address=0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7&page=1&offset=100&sort=desc&apikey=YourApiKeyToken
    const { error, result } = await this.apiFetch<EtherscanTxListResult>({
      module: 'account',
      action: 'txlist',
      address: contractAddress,
      page,
      offset,
      sort,
    });
    // Not sure why etherscan consider this an error
    if (error === 'No transactions found') {
      return [];
    } else if (error) {
      throw new Error(`Etherscan#fetchTxList unhandled error: ${error}`);
    }
    return result;
  }

  async apiFetch<T>(query: Record<string, unknown>): Promise<EtherscanParsedResponse<T>> {
    if (!this.apiURL) {
      throw new Error(`No API URL for ${this.baseURL}`);
    }
    const queryWithApiKey = new URLSearchParams({
      ...query,
      apikey: this.apiKey,
    }).toString();
    const url = `${this.apiURL}/api?${queryWithApiKey}`;
    console.info(`GET ${url}`);
    const response = await fetch(url);
    const json: EtherscanApiResponse<T> = await response.json();
    if (json?.status !== '1') {
      console.error('Etherscan error:', json);
      return {
        error: json.message ?? 'unhandled etherscan error',
        result: json.result,
      };
    }
    return { result: json.result };
  }
}

export const explorers = {
  ethereum: {
    mainnet: new Etherscan({
      baseURL: 'https://etherscan.io',
      apiURL: 'https://api.etherscan.io',
      apiKey: getEnv('ETHERSCAN_API_KEY'),
    }),
    goerli: new Etherscan({
      baseURL: 'https://goerli.etherscan.io',
      apiURL: 'https://api-goerli.etherscan.io',
      apiKey: getEnv('ETHERSCAN_API_KEY'),
    }),
  },
  arbitrum: {
    mainnet: new Etherscan({
      baseURL: 'https://arbiscan.io',
      apiURL: 'https://api.arbiscan.io',
      apiKey: getEnv('ETHERSCAN_ARBITRUM_API_KEY'),
    }),
  },
  optimism: {
    mainnet: new Etherscan({
      baseURL: 'https://optimistic.etherscan.io',
      apiURL: 'https://api-optimistic.etherscan.io',
      apiKey: getEnv('ETHERSCAN_OPTIMISM_API_KEY'),
    }),
  },
};
