import fetch from 'isomorphic-fetch';

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
export interface EtherscanTx {
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
  methodId?: string; // '0x3df02124'; // missing for some chains (optimism)
  functionName?: string; // 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy)'; -- not present for some chains
}
export type EtherscanTxListResult = Array<EtherscanTx>;

export interface EtherscanLog {
  address: string; // "0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7",
  topics: Array<string>; // ["0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140", "0x0000000000000000000000004dda7e6831592cf7ec58aa4f2cf76350e73bbfc8"],
  data: string; // "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000037e11d600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000032c56f1b2f917e4e6c4",
  blockNumber: string; // "0xc481a5",
  timeStamp: string; // "0x60f9d0d6",
  gasPrice: string; //"0xcce416600",
  gasUsed: string; // "0x1d195",
  logIndex: string; // "0xd0",
  transactionHash: string; //"0x56f587d22597e0bae38f1a665f5b83f3a11d936aa739476f03c5b1acaf406260",
  transactionIndex: string; //"0x2d"
}

export type EtherscanLogsResult = Array<EtherscanLog>;

export type EtherscanABIResult = Record<string, unknown>;

type EtherscanProps = { baseURL: string; apiURL: string; apiKey?: string };
export class Etherscan {
  baseURL: string;
  apiURL: string;
  apiKey?: string;

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

  async fetchLogs({
    contractAddress,
    fromBlock,
    toBlock,
    page = 1,
    offset = 1000,
  }: {
    contractAddress: string;
    fromBlock: number;
    toBlock: number;
    page?: number;
    offset?: number;
  }): Promise<EtherscanLogsResult> {
    const { error, result } = await this.apiFetch<EtherscanLogsResult>({
      module: 'logs',
      action: 'getLogs',
      address: contractAddress,
      page,
      offset,
      fromBlock,
      toBlock,
    });
    // Not sure why etherscan consider this an error
    if (error === 'No records found') {
      return [];
    } else if (error) {
      throw new Error(`Etherscan#fetchLogs unhandled error: ${error}`);
    }
    return result;
  }

  async fetchBlockNumberByTimestamp({
    timestamp,
    closest = 'before',
  }: {
    timestamp: number;
    closest?: 'before' | 'after';
  }): Promise<number> {
    const { error, result } = await this.apiFetch<string>({
      module: 'block',
      action: 'getblocknobytime',
      timestamp,
      closest,
    });
    if (error || !result || result.toLowerCase().startsWith('error')) {
      console.warn(result);
      throw new Error(`Etherscan#fetchBlockNumberByTimestamp unhandled error: ${error}`);
    }
    return Number(result);
  }

  async apiFetch<T>(query: Record<string, unknown>): Promise<EtherscanParsedResponse<T>> {
    if (!this.apiURL) {
      throw new Error(`No API URL for ${this.baseURL}`);
    }
    if (!this.apiKey) {
      throw new Error(`No API key for ${this.baseURL}`);
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
