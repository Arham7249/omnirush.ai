export type ChainConfig = {
  id: string;
  name: string;
  shortName: string;
  explorer: string;
  color: string;
};

export const CHAINS: ChainConfig[] = [
  { id: "1", name: "Ethereum", shortName: "ETH", explorer: "https://eth.blockscout.com", color: "#0066ff" },
  { id: "8453", name: "Base", shortName: "BASE", explorer: "https://base.blockscout.com", color: "#0052ff" },
  { id: "10", name: "Optimism", shortName: "OP", explorer: "https://optimism.blockscout.com", color: "#0284c7" },
  { id: "42161", name: "Arbitrum One", shortName: "ARB", explorer: "https://arbitrum.blockscout.com", color: "#00b4d8" },
  { id: "137", name: "Polygon", shortName: "POL", explorer: "https://polygon.blockscout.com", color: "#06b6d4" }
];

export type AddressRecord = {
  hash?: string;
  name?: string | null;
  ens_domain_name?: string | null;
  coin_balance?: string | null;
  exchange_rate?: string | null;
  is_contract?: boolean;
  is_verified?: boolean;
  implementations?: unknown[];
};

export type CounterRecord = {
  transactions_count?: string | number;
  token_transfers_count?: string | number;
  gas_usage_count?: string | number;
  validations_count?: string | number;
};

export type TransactionRecord = {
  hash?: string;
  timestamp?: string;
  status?: string;
  result?: string;
  method?: string | null;
  value?: string;
  fee?: { value?: string };
  from?: { hash?: string; name?: string | null; is_contract?: boolean };
  to?: { hash?: string; name?: string | null; is_contract?: boolean } | null;
  transaction_types?: string[];
};

export type TokenTransferRecord = {
  transaction_hash?: string;
  timestamp?: string;
  type?: string;
  method?: string;
  from?: { hash?: string; name?: string | null };
  to?: { hash?: string; name?: string | null };
  token?: { name?: string; symbol?: string; decimals?: string; type?: string; address_hash?: string };
  total?: { value?: string; decimals?: string; token_id?: string };
};

export type ChainSnapshot = {
  chain: ChainConfig;
  address: AddressRecord;
  counters: CounterRecord;
  transactions: TransactionRecord[];
  tokenTransfers: TokenTransferRecord[];
  error?: string;
};

const API_ROOT = "https://api.blockscout.com";

async function blockscoutGet<T>(chainId: string, path: string, apiKey?: string): Promise<T> {
  const url = new URL(`${API_ROOT}/${chainId}/api/v2${path}`);
  if (apiKey) url.searchParams.set("apikey", apiKey);
  const response = await fetch(url, {
    headers: apiKey ? { authorization: `Bearer ${apiKey}` } : undefined,
    signal: AbortSignal.timeout(12_000)
  });
  if (!response.ok) throw new Error(`Blockscout returned ${response.status}`);
  return response.json() as Promise<T>;
}

function items<T>(payload: { items?: T[] } | undefined): T[] {
  return payload?.items ?? [];
}

export async function fetchChainSnapshot(address: string, chain: ChainConfig, apiKey?: string): Promise<ChainSnapshot> {
  const results = await Promise.allSettled([
    blockscoutGet<AddressRecord>(chain.id, `/addresses/${address}`, apiKey),
    blockscoutGet<CounterRecord>(chain.id, `/addresses/${address}/counters`, apiKey),
    blockscoutGet<{ items?: TransactionRecord[] }>(chain.id, `/addresses/${address}/transactions`, apiKey),
    blockscoutGet<{ items?: TokenTransferRecord[] }>(chain.id, `/addresses/${address}/token-transfers`, apiKey)
  ]);

  const [addressResult, countersResult, transactionsResult, transfersResult] = results;
  const failed = results.find((result): result is PromiseRejectedResult => result.status === "rejected");
  return {
    chain,
    address: addressResult.status === "fulfilled" ? addressResult.value : { hash: address },
    counters: countersResult.status === "fulfilled" ? countersResult.value : {},
    transactions: transactionsResult.status === "fulfilled" ? items(transactionsResult.value) : [],
    tokenTransfers: transfersResult.status === "fulfilled" ? items(transfersResult.value) : [],
    error: failed?.reason instanceof Error ? failed.reason.message : undefined
  };
}
