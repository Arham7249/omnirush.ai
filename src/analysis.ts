import { ChainSnapshot, TokenTransferRecord, TransactionRecord } from "./blockscout";

export type Signal = {
  severity: "high" | "medium" | "low" | "info";
  title: string;
  detail: string;
  evidence: string;
};

export type Investigation = {
  address: string;
  generatedAt: string;
  mode: "live" | "demo";
  chains: ChainSnapshot[];
  signals: Signal[];
  score: number;
  totals: {
    activeChains: number;
    transactions: number;
    tokenTransfers: number;
    nativeBalance: number;
  };
  recentActivity: Array<{
    chain: string;
    chainId: string;
    hash: string;
    timestamp: string;
    label: string;
    status: string;
    explorerUrl: string;
  }>;
};

const asNumber = (value: string | number | null | undefined): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const short = (value = "") => value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "unknown";
const normalize = (value = "") => value.toLowerCase();

function transferAmount(transfer: TokenTransferRecord): number {
  const raw = asNumber(transfer.total?.value);
  const decimals = asNumber(transfer.total?.decimals ?? transfer.token?.decimals);
  return decimals > 0 ? raw / 10 ** Math.min(decimals, 18) : raw;
}

function addressLooksLike(target: string, candidate: string): boolean {
  const a = normalize(target);
  const b = normalize(candidate);
  if (!a || !b || a === b || a.length < 12 || b.length < 12) return false;
  return a.slice(0, 6) === b.slice(0, 6) && a.slice(-4) === b.slice(-4);
}

export function analyze(address: string, chains: ChainSnapshot[], mode: "live" | "demo"): Investigation {
  const allTransactions = chains.flatMap((snapshot) => snapshot.transactions.map((transaction) => ({ transaction, snapshot })));
  const allTransfers = chains.flatMap((snapshot) => snapshot.tokenTransfers.map((transfer) => ({ transfer, snapshot })));
  const failedTransactions = allTransactions.filter(({ transaction }) => transaction.status === "error" || transaction.result?.toLowerCase().includes("error"));
  const dustTransfers = allTransfers.filter(({ transfer }) => transferAmount(transfer) > 0 && transferAmount(transfer) < 0.0001);
  const lookalikes = allTransfers.filter(({ transfer }) => {
    const from = transfer.from?.hash ?? "";
    const to = transfer.to?.hash ?? "";
    return addressLooksLike(address, from) || addressLooksLike(address, to);
  });
  const contractCalls = allTransactions.filter(({ transaction }) => transaction.to?.is_contract && transaction.method);
  const activeChains = chains.filter((snapshot) => snapshot.transactions.length > 0 || snapshot.tokenTransfers.length > 0).length;

  const signals: Signal[] = [];
  if (lookalikes.length > 0) {
    signals.push({
      severity: "high",
      title: "Possible address-poisoning pattern",
      detail: `${lookalikes.length} transfer${lookalikes.length === 1 ? "" : "s"} involve an address sharing the wallet's visible prefix and suffix.`,
      evidence: `${short(lookalikes[0].transfer.from?.hash ?? lookalikes[0].transfer.to?.hash)} on ${lookalikes[0].snapshot.chain.name}`
    });
  }
  if (dustTransfers.length > 0) {
    signals.push({
      severity: "medium",
      title: "Dust-transfer activity",
      detail: `${dustTransfers.length} very small token transfer${dustTransfers.length === 1 ? "" : "s"} may be noise, bait, or an attribution probe.`,
      evidence: `${dustTransfers[0].transfer.token?.symbol ?? "Token"} on ${dustTransfers[0].snapshot.chain.name}`
    });
  }
  if (failedTransactions.length >= 3) {
    signals.push({
      severity: "medium",
      title: "Repeated failed transactions",
      detail: `${failedTransactions.length} failed calls were found in the latest Blockscout activity window.`,
      evidence: `${failedTransactions[0].snapshot.chain.name} · ${short(failedTransactions[0].transaction.hash)}`
    });
  }
  if (contractCalls.length > 0) {
    signals.push({
      severity: "info",
      title: "Contract-heavy wallet",
      detail: `${contractCalls.length} recent interactions were decoded as calls to verified or identified contracts.`,
      evidence: `${new Set(contractCalls.map(({ snapshot }) => snapshot.chain.name)).size} chain${new Set(contractCalls.map(({ snapshot }) => snapshot.chain.name)).size === 1 ? "" : "s"} with contract activity`
    });
  }
  if (activeChains >= 2) {
    signals.push({
      severity: "info",
      title: "Cross-chain footprint detected",
      detail: `This wallet is active across ${activeChains} chains in the selected scan.`,
      evidence: chains.filter((snapshot) => snapshot.transactions.length || snapshot.tokenTransfers.length).map(({ chain }) => chain.shortName).join(" · ")
    });
  }
  if (signals.length === 0) {
    signals.push({ severity: "info", title: "No immediate red flags", detail: "The selected Blockscout activity did not trigger the current heuristics.", evidence: "Keep monitoring new activity" });
  }

  const score = Math.min(100, lookalikes.length * 35 + Math.min(25, dustTransfers.length * 5) + Math.min(20, failedTransactions.length * 4));
  const recentActivity = allTransactions
    .sort((a, b) => new Date(b.transaction.timestamp ?? 0).getTime() - new Date(a.transaction.timestamp ?? 0).getTime())
    .slice(0, 8)
    .map(({ transaction, snapshot }) => ({
      chain: snapshot.chain.shortName,
      chainId: snapshot.chain.id,
      hash: transaction.hash ?? "",
      timestamp: transaction.timestamp ?? "",
      label: transaction.method || transaction.transaction_types?.[0]?.replaceAll("_", " ") || "transaction",
      status: transaction.status ?? "unknown",
      explorerUrl: `${snapshot.chain.explorer}/tx/${transaction.hash ?? ""}`
    }));

  return {
    address,
    generatedAt: new Date().toISOString(),
    mode,
    chains,
    signals,
    score,
    totals: {
      activeChains,
      transactions: allTransactions.length,
      tokenTransfers: allTransfers.length,
      nativeBalance: chains.reduce((sum, snapshot) => sum + asNumber(snapshot.address.coin_balance) / 10 ** 18, 0)
    },
    recentActivity
  };
}
