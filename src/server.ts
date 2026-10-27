import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyze } from "./analysis";
import { CHAINS, ChainSnapshot, fetchChainSnapshot } from "./blockscout";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const addressPattern = /^0x[a-fA-F0-9]{40}$/;

function demoSnapshot(address: string, chainIndex: number): ChainSnapshot {
  const chain = CHAINS[chainIndex];
  const now = Date.now();
  const txHash = `0x${address.slice(2, 18)}${chain.id.padStart(8, "0")}${"a".repeat(40)}`.slice(0, 66);
  const contract = chainIndex % 2 === 0;
  const isVitalik = address.toLowerCase() === "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
  const isBinance = address.toLowerCase() === "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8";
  const isRouter = address.toLowerCase() === "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97";
  const isPoisonDemo = address.toLowerCase() === "0x742d35cc6634c0532925a3b844bc454e4438f44e";

  const ensName = isVitalik
    ? "vitalik.eth"
    : chainIndex === 0
      ? "signalpath.eth"
      : null;

  const addressName = isBinance ? "Binance 7 Hot Wallet" : isRouter ? "Uniswap: Universal Router" : null;

  return {
    chain,
    address: {
      hash: address,
      name: addressName,
      ens_domain_name: ensName,
      coin_balance: String((isBinance ? 4850 : isVitalik ? 245.5 : (0.18 + chainIndex * 0.07)) * 10 ** 18)
    },
    counters: {
      transactions_count: isBinance ? 124500 : isVitalik ? 4820 : (18 + chainIndex * 9),
      token_transfers_count: isBinance ? 89300 : isVitalik ? 3140 : (7 + chainIndex * 3)
    },
    transactions: [
      {
        hash: txHash,
        timestamp: new Date(now - chainIndex * 3_600_000).toISOString(),
        status: "ok",
        method: isRouter ? "executeBatch" : contract ? "swapExactTokensForTokens" : "transfer",
        from: { hash: address },
        to: { hash: `0x${"1".repeat(40)}`, is_contract: contract },
        transaction_types: [contract ? "contract_call" : "coin_transfer"]
      },
      {
        hash: `${txHash.slice(0, -2)}bb`,
        timestamp: new Date(now - (chainIndex + 2) * 86_400_000).toISOString(),
        status: (isPoisonDemo && chainIndex === 1) ? "error" : "ok",
        method: isRouter ? "multicall" : "approve",
        from: { hash: address },
        to: { hash: `0x${"2".repeat(40)}`, is_contract: true },
        transaction_types: ["contract_call"]
      }
    ],
    tokenTransfers: [
      {
        transaction_hash: txHash,
        timestamp: new Date(now - chainIndex * 3_600_000).toISOString(),
        type: "token_transfer",
        from: { hash: `0x${"3".repeat(40)}` },
        to: { hash: address },
        token: { symbol: chainIndex % 2 ? "USDC" : "WETH", name: chainIndex % 2 ? "USD Coin" : "Wrapped Ether", decimals: "6" },
        total: { value: String(isBinance ? 5000000000 : isVitalik ? 25000000 : (1250000 + chainIndex * 100000)), decimals: "6" }
      },
      ...((chainIndex === 0 || isPoisonDemo)
        ? [{
            transaction_hash: `${txHash.slice(0, -2)}cc`,
            timestamp: new Date(now - 5 * 86_400_000).toISOString(),
            type: "token_transfer",
            from: { hash: `${address.slice(0, 6)}${"9".repeat(32)}${address.slice(-4)}` },
            to: { hash: address },
            token: { symbol: "USDT", name: "Tether USD", decimals: "6" },
            total: { value: "1", decimals: "6" }
          }]
        : [])
    ]
  };
}

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/api/chains", (_request, response) => response.json(CHAINS));

app.get("/api/investigate", async (request, response) => {
  response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const address = String(request.query.address ?? "");
  if (!addressPattern.test(address)) {
    return response.status(400).json({ error: "Enter a valid 0x wallet address (42 characters)." });
  }

  const requested = String(request.query.chains ?? "1,8453,10").split(",");
  const chains = CHAINS.filter((chain) => requested.includes(chain.id));
  if (chains.length === 0) return response.status(400).json({ error: "Select at least one chain." });

  const apiKey = process.env.BLOCKSCOUT_API_KEY;
  const snapshots = apiKey
    ? await Promise.all(chains.map((chain) => fetchChainSnapshot(address, chain, apiKey)))
    : chains.map((_, index) => demoSnapshot(address, CHAINS.indexOf(chains[index])));
  const mode = apiKey ? "live" : "demo";
  return response.json(analyze(address, snapshots, mode));
});

app.use((_request, response) => response.sendFile(path.join(process.cwd(), "public", "index.html")));

app.listen(port, () => {
  console.log(`Signalpath running at http://localhost:${port}`);
  console.log(process.env.BLOCKSCOUT_API_KEY ? "Blockscout mode: live" : "Blockscout mode: demo (add BLOCKSCOUT_API_KEY for live data)");
});
