/**
 * omnirush.ai · Signalpath
 * 3D Spatial Architecture, Interactive Particle Canvas & Multichain Forensics
 * Strict High-Contrast Light Scheme · Mechanical Micro-interactions
 */

const state = {
  chains: [],
  selected: new Set(["1", "8453", "10", "42161", "137"]),
  data: null,
  activityFilter: "all",
  activityQuery: ""
};

// Utilities
const $ = (id) => document.getElementById(id);
const short = (val = "") => val ? `${val.slice(0, 6)}…${val.slice(-4)}` : "—";
const number = (val) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number(val || 0));
const escapeHtml = (val = "") => String(val).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);

const timeAgo = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays < 30 ? `${diffDays}d ago` : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/* ==========================================================================
   VIEWPORT LAYER 1: INTERACTIVE KINETIC PARTICLE CANVAS ENGINE
   ========================================================================== */
function initInteractiveCanvas() {
  const canvas = $("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let dpr = window.devicePixelRatio || 1;

  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Particle constellation configuration (Electric Blue & Cyan tints)
  const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 28000));
  const particles = [];
  const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * (width / dpr),
      y: Math.random() * (height / dpr),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1,
      color: i % 2 === 0 ? "rgba(0, 102, 255, " : "rgba(0, 180, 216, "
    });
  }

  window.addEventListener("pointermove", (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    mouse.active = false;
  }, { passive: true });

  let animationFrameId = null;

  const renderCanvas = () => {
    if (document.hidden) {
      animationFrameId = requestAnimationFrame(renderCanvas);
      return;
    }

    const cssWidth = width / dpr;
    const cssHeight = height / dpr;

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.15;
    mouse.y += (mouse.targetY - mouse.y) * 0.15;

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      // Update position
      p1.x += p1.vx;
      p1.y += p1.vy;

      // Soft bounce
      if (p1.x < 0 || p1.x > cssWidth) p1.vx *= -1;
      if (p1.y < 0 || p1.y > cssHeight) p1.vy *= -1;

      // Mouse repulsion / drift
      if (mouse.active) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          p1.x += (dx / dist) * force * 1.5;
          p1.y += (dy / dist) * force * 1.5;
        }
      }

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p1.color}0.65)`;
      ctx.fill();

      // Connecting lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(renderCanvas);
  };

  renderCanvas();
}

/* ==========================================================================
   VIEWPORT LAYER 2: 3D SPATIAL PARALLAX & GYROSCOPE ENGINE
   ========================================================================== */
function setupSpatialParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const containers = [...document.querySelectorAll(".floating-container")];

  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let currentPointer = { x: pointer.x, y: pointer.y };
  let frameId = 0;

  const updateSpatialField = () => {
    frameId = 0;

    // Smooth lerp for buttery camera transition
    currentPointer.x += (pointer.x - currentPointer.x) * 0.12;
    currentPointer.y += (pointer.y - currentPointer.y) * 0.12;

    const normX = currentPointer.x / window.innerWidth - 0.5;
    const normY = currentPointer.y / window.innerHeight - 0.5;

    document.documentElement.style.setProperty("--pointer-x", normX.toFixed(4));
    document.documentElement.style.setProperty("--pointer-y", normY.toFixed(4));

    // Update each floating container's individual pitch, yaw, and shadow offset
    containers.forEach((card) => {
      const bounds = card.getBoundingClientRect();
      // Skip offscreen elements to save GPU cycles
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;

      const depth = Number(card.dataset.depth || 1);
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const localX = Math.max(-1, Math.min(1, (currentPointer.x - centerX) / (bounds.width * 0.75)));
      const localY = Math.max(-1, Math.min(1, (currentPointer.y - centerY) / (bounds.height * 0.75)));

      const tiltX = (localX * depth * 2.8).toFixed(2);
      const tiltY = (-localY * depth * 2.4).toFixed(2);
      const shadowX = (localX * depth * 12).toFixed(1);
      const shadowY = (14 + Math.abs(localY) * depth * 8).toFixed(1);

      card.style.setProperty("--tilt-x", `${tiltX}deg`);
      card.style.setProperty("--tilt-y", `${tiltY}deg`);
      card.style.setProperty("--shadow-x", `${shadowX}px`);
      card.style.setProperty("--shadow-y", `${shadowY}px`);
      card.style.transform = `perspective(1200px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    });

    if (Math.abs(pointer.x - currentPointer.x) > 0.1 || Math.abs(pointer.y - currentPointer.y) > 0.1) {
      frameId = requestAnimationFrame(updateSpatialField);
    }
  };

  const scheduleUpdate = () => {
    if (!frameId) frameId = requestAnimationFrame(updateSpatialField);
  };

  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    scheduleUpdate();
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    pointer.x = window.innerWidth / 2;
    pointer.y = window.innerHeight / 2;
    scheduleUpdate();
  }, { passive: true });

  scheduleUpdate();
}

/* ==========================================================================
   CHAIN PICKER COMPONENT
   ========================================================================== */
function renderChainPicker() {
  const container = $("chain-picker");
  if (!container) return;

  container.innerHTML = state.chains.map((chain) => {
    const isSelected = state.selected.has(chain.id);
    return `
      <button
        type="button"
        class="chain-toggle-chip ${isSelected ? "selected" : ""}"
        data-chain="${escapeHtml(chain.id)}"
        aria-pressed="${isSelected}"
        title="${escapeHtml(chain.name)}"
      >
        <span class="chain-dot-indicator" style="background:${escapeHtml(chain.color)}"></span>
        <span>${escapeHtml(chain.shortName)}</span>
      </button>
    `;
  }).join("");

  container.querySelectorAll(".chain-toggle-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const chainId = button.dataset.chain;
      if (state.selected.has(chainId)) {
        if (state.selected.size === 1) return; // Keep at least one chain
        state.selected.delete(chainId);
      } else {
        state.selected.add(chainId);
      }
      updateScene(state.selected.size);
      renderChainPicker();
    });
  });
}

function updateScene(chainCount = state.selected.size, active = false) {
  const valueElem = $("scene-value");
  const captionElem = $("scene-caption");
  if (valueElem) valueElem.textContent = String(chainCount).padStart(2, "0");
  if (captionElem) {
    captionElem.textContent = active
      ? `RADAR / ${chainCount} CHAINS ACTIVE`
      : "RADAR / SCAN READY";
  }
}

/* ==========================================================================
   RENDERERS: SIGNALS, FOOTPRINT, ACTIVITY, PROOF
   ========================================================================== */
function renderSignals(signals = []) {
  $("signal-count").textContent = signals.length;
  const list = $("signals-list");

  if (signals.length === 0) {
    list.innerHTML = `<div class="empty-state-notice">No risk signals detected in current activity window.</div>`;
    return;
  }

  list.innerHTML = signals.map((signal) => {
    return `
      <div class="signal-row">
        <span class="signal-status-dot ${escapeHtml(signal.severity)}"></span>
        <div class="signal-main-info">
          <h5>${escapeHtml(signal.title)}</h5>
          <p>${escapeHtml(signal.detail)}</p>
        </div>
        <div class="signal-evidence-pill">${escapeHtml(signal.evidence)}</div>
      </div>
    `;
  }).join("");
}

function renderFootprint(chains = []) {
  const container = $("footprint");
  const maxEvents = Math.max(...chains.map((item) => (item.transactions?.length || 0) + (item.tokenTransfers?.length || 0)), 1);

  container.innerHTML = chains.map((item) => {
    const activityCount = (item.transactions?.length || 0) + (item.tokenTransfers?.length || 0);
    const percentage = Math.max(8, Math.round((activityCount / maxEvents) * 100));
    const statusText = item.error ? "Network Error" : `${activityCount} events`;

    return `
      <div class="chain-footprint-row">
        <div class="chain-footprint-header">
          <div class="chain-identity-group">
            <span class="chain-color-badge" style="background:${escapeHtml(item.chain.color)}"></span>
            <span>${escapeHtml(item.chain.name)}</span>
          </div>
          <span class="chain-event-count" style="${item.error ? "color:var(--red-critical)" : ""}">
            ${escapeHtml(statusText)}
          </span>
        </div>
        <div class="footprint-bar-track">
          <div class="footprint-bar-fill" style="width:${percentage}%; background:${escapeHtml(item.chain.color)}"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderActivity() {
  const list = $("activity-list");
  const activity = (state.data?.recentActivity || []).filter((item) => {
    const statusMatch = state.activityFilter === "all" || item.status === state.activityFilter;
    const q = state.activityQuery.toLowerCase();
    const queryMatch = !q || `${item.chain} ${item.label} ${item.hash}`.toLowerCase().includes(q);
    return statusMatch && queryMatch;
  });

  list.innerHTML = activity.map((item) => {
    const isError = item.status === "error";
    return `
      <tr>
        <td class="td-chain-tag">${escapeHtml(item.chain)}</td>
        <td class="td-action-label">${escapeHtml(item.label)}</td>
        <td class="td-timestamp">${escapeHtml(timeAgo(item.timestamp))}</td>
        <td>
          <span class="status-badge-inline ${isError ? "failed" : ""}">
            ${isError ? "✕ Failed" : "✓ Confirmed"}
          </span>
        </td>
        <td>
          <a class="tx-hash-link" href="${escapeHtml(item.explorerUrl)}" target="_blank" rel="noreferrer" title="Inspect on Blockscout">
            ${escapeHtml(short(item.hash))} ↗
          </a>
        </td>
      </tr>
    `;
  }).join("");

  $("activity-empty").classList.toggle("hidden", activity.length > 0);
}

function renderEvidence(chains = [], address = "") {
  const container = $("evidence-links");
  container.innerHTML = chains.map((item) => {
    const totalEvents = (item.transactions?.length || 0) + (item.tokenTransfers?.length || 0);
    return `
      <a class="trace-link-card" href="${escapeHtml(item.chain.explorer)}/address/${escapeHtml(address)}" target="_blank" rel="noreferrer">
        <div class="trace-link-info">
          <strong>${escapeHtml(item.chain.name)} Explorer</strong>
          <small>${escapeHtml(short(address))} · ${totalEvents} records retrieved</small>
        </div>
        <span class="trace-link-arrow">↗</span>
      </a>
    `;
  }).join("");
}

function updateRisk(score) {
  const copy = score >= 60 ? "High risk patterns detected" : score >= 25 ? "Review suggested" : "No immediate threats";
  const label = score >= 60 ? "HIGH ATTENTION" : score >= 25 ? "REVIEW SUGGESTED" : "LOW ATTENTION";
  const levelClass = score >= 60 ? "high" : score >= 25 ? "warn" : "";

  $("score").textContent = score;
  $("score-copy").textContent = copy;

  const badge = $("risk-badge");
  badge.textContent = label;
  badge.className = `severity-pill ${levelClass}`;

  const bar = $("score-bar");
  bar.style.width = `${Math.max(4, score)}%`;
  bar.className = `risk-progress-fill ${levelClass}`;
}

function render(data) {
  state.data = data;
  $("loading").classList.add("hidden");
  $("error").classList.add("hidden");
  $("results").classList.remove("hidden");

  const isDemo = data.mode === "demo";
  const modeBanner = $("mode-banner");
  modeBanner.className = `mode-ribbon ${isDemo ? "demo" : ""}`;
  $("mode-pill").textContent = isDemo ? "DEMO MODE" : "LIVE SCAN";
  $("mode-text").textContent = isDemo
    ? "Demo mode active · Add BLOCKSCOUT_API_KEY in .env for live multi-chain data."
    : "Live scan active · Grounded in Blockscout PRO API endpoints.";
  $("data-source").textContent = isDemo ? "sample forensic brief" : "source: api.blockscout.com";

  $("address-title").textContent = data.address;
  $("timestamp").textContent = `Brief generated ${new Date(data.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  $("active-chains").textContent = data.totals.activeChains;
  $("transactions").textContent = number(data.totals.transactions);
  $("transfers").textContent = number(data.totals.tokenTransfers);

  updateRisk(data.score);
  renderSignals(data.signals);
  renderFootprint(data.chains);
  renderEvidence(data.chains, data.address);

  state.activityFilter = "all";
  state.activityQuery = "";
  $("activity-filter").value = "all";
  $("activity-search").value = "";
  renderActivity();

  const primaryChain = data.chains[0]?.chain;
  $("explorer-link").href = primaryChain
    ? `${primaryChain.explorer}/address/${encodeURIComponent(data.address)}`
    : "https://blockscout.com";

  updateScene(data.totals.activeChains, true);

  // Smooth scroll to results
  window.requestAnimationFrame(() => {
    $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function showError(msg) {
  $("loading").classList.add("hidden");
  $("results").classList.add("hidden");
  $("error").classList.remove("hidden");
  $("error-message").textContent = msg;
}

/* ==========================================================================
   SCAN EXECUTION & USER ACTIONS
   ========================================================================== */
async function scan(event) {
  event?.preventDefault();
  const rawInput = $("address").value.trim();
  const address = rawInput.startsWith("0x") ? rawInput : `0x${rawInput}`;

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    showError("Please enter a valid 40-character hexadecimal Ethereum/EVM wallet address (0x...).");
    return;
  }

  $("address").value = address.slice(2);
  $("results").classList.add("hidden");
  $("error").classList.add("hidden");
  $("loading").classList.remove("hidden");

  try {
    const params = new URLSearchParams({
      address,
      chains: [...state.selected].join(",")
    });
    const response = await fetch(`/api/investigate?${params}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Investigation scan failed");
    render(data);
  } catch (err) {
    showError(err instanceof Error ? err.message : "Unable to complete forensic scan.");
  }
}

async function copyAddress() {
  if (!state.data?.address) return;
  try {
    await navigator.clipboard.writeText(state.data.address);
  } catch {
    return;
  }
  const btn = $("copy-address");
  btn.textContent = "Copied!";
  setTimeout(() => { btn.textContent = "Copy"; }, 1500);
}

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();
    const cleaned = text.trim();
    if (cleaned.startsWith("0x")) {
      $("address").value = cleaned.slice(2);
    } else {
      $("address").value = cleaned;
    }
  } catch {
    $("address").focus();
  }
}

function downloadBrief() {
  if (!state.data) return;
  const d = state.data;
  const lines = [
    `# Signalpath Forensic Investigation Dossier`,
    `Generated by omnirush.ai · Blockscout PRO API`,
    ``,
    `- Target Address: \`${d.address}\``,
    `- Generated At: ${d.generatedAt}`,
    `- Scan Mode: ${d.mode}`,
    `- Heuristic Risk Score: ${d.score}/100`,
    `- Active Networks: ${d.totals.activeChains}`,
    `- Total Transactions: ${d.totals.transactions}`,
    `- Token Transfers: ${d.totals.tokenTransfers}`,
    `- Native Holdings: ${d.totals.nativeBalance.toFixed(4)} native coins`,
    ``,
    `## Detected Signals & Anomalies`,
    ...d.signals.map((s) => `### [${s.severity.toUpperCase()}] ${s.title}\n${s.detail}\n- Evidence: \`${s.evidence}\`\n`),
    ``,
    `## Recent Onchain Evidence (Blockscout)`,
    ...d.recentActivity.map((a) => `- **${a.chain}** · \`${a.label}\` · Status: ${a.status} · [Inspect Tx](${a.explorerUrl})`),
    ``,
    `---`,
    `*Report generated by Signalpath (omnirush.ai). All evidence verified against public block explorers.*`
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `signalpath-investigation-${d.address.slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function resetScan() {
  $("results").classList.add("hidden");
  $("error").classList.add("hidden");
  $("loading").classList.add("hidden");
  $("address").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupPresets() {
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const presetAddr = btn.dataset.address;
      if (!presetAddr) return;
      $("address").value = presetAddr.startsWith("0x") ? presetAddr.slice(2) : presetAddr;
      scan();
    });
  });
}

function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const sectionIds = ["overview", "signals", "footprint-section", "activity", "evidence"];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { rootMargin: "-30% 0px -60%" });

  sectionIds.forEach((id) => {
    const elem = $(id);
    if (elem) observer.observe(elem);
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
async function init() {
  try {
    const response = await fetch("/api/chains");
    state.chains = await response.json();
    renderChainPicker();
  } catch {
    showError("Could not load chain configurations.");
  }

  initInteractiveCanvas();
  setupSpatialParallax();
  setupPresets();
  setupNavigation();

  $("scan-form").addEventListener("submit", scan);
  $("new-scan").addEventListener("click", resetScan);
  $("retry-scan").addEventListener("click", () => scan());
  $("copy-address").addEventListener("click", copyAddress);
  $("paste-btn").addEventListener("click", handlePaste);
  $("download-brief").addEventListener("click", downloadBrief);

  $("activity-filter").addEventListener("change", (e) => {
    state.activityFilter = e.target.value;
    renderActivity();
  });

  $("activity-search").addEventListener("input", (e) => {
    state.activityQuery = e.target.value;
    renderActivity();
  });

  updateScene();
}

// Boot application
init();
