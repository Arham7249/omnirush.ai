# omnirush.ai · Signalpath
### *Multichain Forensic Wallet Briefs Powered by Blockscout PRO API*

> **🏆 Blockscout Hackathon 2026 Submission**  
> **Live Demo & Local Setup:** `npm install && npm run dev` → `http://localhost:3000`  
> **Key Architecture Highlights:** 3D Spatial UI System · Pure Electric Blue & White Light Theme · Blockscout PRO API Unified Parallel Scanner

---

## ⚡ The Problem: Multichain Noise & Forensic Fatigue
Investigating on-chain behavior across EVM networks (Ethereum, Base, Optimism, Arbitrum, Polygon) is slow, fragmented, and error-prone:
1. **Explorer Fragmentation:** Analysts and users must open 4–5 different explorer tabs, manually cross-reference tx hashes, and decode raw bytecode.
2. **Attribution Scams & Obfuscation:** Modern exploiters weaponize **address poisoning** (generating lookalike addresses matching the victim's first 6 and last 4 characters) and **dust probes** to trick users into copying malicious addresses from recent transaction history.
3. **Black-box Heuristics:** Existing wallet scanners assign arbitrary risk scores without exposing verifiable on-chain evidence.

---

## 💡 The Solution: omnirush.ai (Signalpath)
**Signalpath** turns any 0x wallet address into an explainable, multichain forensic investigation brief in under 2 seconds.

- **Unified Blockscout PRO API Engine:** Queries address metadata, transaction counters, latest transactions, and token transfers in parallel across 5 EVM networks.
- **Forensic Signal Detection:**
  - 🚨 **Address Poisoning Detection:** Identifies lookalike transfer counterparties matching the target's visible prefix and suffix.
  - ⚠️ **Dust Probe Alerts:** Flags micro-value token transfers designed as attribution probes or bait.
  - 🛑 **Failed Execution Ratios:** Surfaces repeated revert spikes indicative of failed exploits or malfunctioning contracts.
  - 🌐 **Cross-Chain Footprint:** Visualizes wallet volume distribution across Ethereum, Base, Optimism, Arbitrum, and Polygon.
- **Mathematical Traceability:** Every metric links directly back to the native **Blockscout block explorer** for verified on-chain proof.

---

## 🎨 3D Spatial UI & Design System

Signalpath introduces a high-performance **3D Spatial Interface System** engineered to replace muddy glassmorphism with crisp, tactile physical slabs:

1. **Two-Plane Viewport Separation:**
   - **Layer 1 (Background Canvas):** A 60fps kinetic particle network in subtle electric blue and cyan tints that responds to mouse coordinates without touching the DOM.
   - **Layer 2 (Interface Plane):** Machined light-acrylic and claymorphic panels with micro-beveled light catches, contact grounding shadows, and diffused elevation shadows.
2. **Hardware-Accelerated Mouse Parallax:**
   - Lightweight `requestAnimationFrame` interpolation engine computing pitch, yaw, and dynamic shadow displacement (`--tilt-x`, `--tilt-y`, `--shadow-x`, `--shadow-y`).
   - Pure GPU compositing with zero scroll hijacking and automated `prefers-reduced-motion` compliance.
3. **Strict High-Contrast Light Theme (Zero Dark Mode, Zero Purples):**
   - High-contrast marine slate text on ultra-clean white satin panels (AAA accessibility contrast).
   - High-energy electric royal blue (`#0066ff`) and vivid cyan (`#00b4d8`) actionable accents.
4. **Mechanical Micro-Interactions:**
   - Real tactile button travel with elevated hover states and snappy dampened spring compression on press.

For full architectural blueprints, see [`SPATIAL_ARCHITECTURE.md`](./SPATIAL_ARCHITECTURE.md).

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Node.js v18+ 
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/your-username/omnirush.ai.git
cd omnirush.ai
npm install
```

### 3. Environment Configuration
Signalpath runs out-of-the-box in **Demo Mode** with realistic forensic test profiles. To connect to live multichain Blockscout data:
```bash
cp .env.example .env
# Open .env and add your Blockscout PRO API key:
# BLOCKSCOUT_API_KEY=your_pro_api_key_here
```

### 4. Launch Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Hackathon Judging Demo Flow

To evaluate Signalpath instantly without looking for test wallets:
1. Open the app at [http://localhost:3000](http://localhost:3000).
2. Under the address bar, click any **Judge Preset**:
   - ⚠️ **Poison Attack Demo:** Highlights an active address-poisoning attack where lookalike transfers match the target address prefix/suffix.
   - 💎 **Vitalik.eth (DeFi):** Shows high-volume multi-chain contract interactions and ENS resolution.
   - 🏦 **Binance 7 Hotwallet:** Demonstrates high-frequency token transfers and liquidity movement.
   - ⚡ **Arbitrage Bot:** Evaluates contract-heavy multicalls and execution metrics.
3. Observe the **Hero 3D Spatial Radar** dynamically orienting its orbital rings based on cursor tracking and active chain count.
4. Review the **Heuristic Risk Gauge**, **Anomaly Signals**, **Chain Footprint**, and **Evidence Ledger**.
5. Click **"Download Forensic Brief"** to export a formatted markdown audit dossier.
6. Click any transaction hash link or chain explorer card to jump directly to **Blockscout** for cryptographic proof.

---

## 🛠️ Stack & Dependencies
- **Backend:** Node.js, Express, TypeScript (`tsx`)
- **API Integration:** Blockscout PRO API (Unified multichain REST endpoints)
- **Frontend:** Vanilla HTML5, CSS3 Custom Properties (Hardware 3D Compositing), Vanilla ES6+
- **Typography:** Space Grotesk (Primary Sans), DM Mono (Monospace Data)
- **Zero Heavy 3D Bloat:** Implements true 3D spatial dynamics and kinetic particle physics with 0MB external 3D libraries (no Three.js or heavy WASM dependencies).

---

## 🗺️ Roadmap & Next Steps
- [ ] **Automated Poisoning Counterparty Graph:** Interactive SVG relationship map linking attacker vanity addresses.
- [ ] **Automated Watchlist Alerts:** Webhook notifications when a flagged address initiates a new multichain transfer.
- [ ] **One-Click PDF Dossier Export:** Cryptographically timestamped PDF export for compliance teams.
- [ ] **Blockscout DApp Store Plugin:** Direct integration as a sidebar widget in the native Blockscout explorer.

---
*Built with ❤️ for the Blockscout Hackathon 2026 by the omnirush.ai team.*
