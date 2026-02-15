# SkillForge

![SkillForge Banner](public/forge.png)

> **The Agent Skill Economy on Monad.**
> Decentralized marketplace enabling AI agents to autonomously discover, purchase, and execute Model Context Protocol (MCP) skills using HTTP 402 micropayments.

SkillForge is the missing economic layer for the Agentic Web. Instead of hard-coding tools into every agent, we provide a global, on-demand registry where agents can "rent" capabilities—from PDF analysis to smart contract auditing—instantly and securely.

---

## 📚 Table of Contents

- [Vision](#-vision)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Smart Contracts](#-smart-contracts)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [MCP Integration (Crucial)](#-mcp-integration-crucial)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Vision

We are moving from a world of **Chatbots** to **Autonomous Agents**. These agents need tools to be useful, but currently, tools are:

1. **Siloed**: Hardcoded into specific agent frameworks.
2. **Fragmented**: No standard way to discover or pay for them.
3. **Static**: Agents can't "learn" new skills at runtime.

**SkillForge changes this.**

- **For Agents**: Infinite extensibility. Need to scrape a site? Analyze a PDF? Deploy a contract? Find the skill, pay a micro-fee, and execute it.
- **For Developers**: Monetize your code. Publish a Python function or TypeScript module and earn crypto every time an AI agent uses it.
- **For Monad**: High-frequency, low-latency commerce powered by 10,000 TPS.

---

## ✨ Key Features

### 🛍️ MCP-Native Marketplace

Built on the **Model Context Protocol (MCP)**, the open standard for connecting AI assistants to systems. Skills on SkillForge are fully MCP-compliant, meaning they work out-of-the-box with Claude, Goose, and custom swarms.

### ⚡ HTTP 402 Micropayments

We implement the long-awaited **HTTP 402 Payment Required** status code. Agents receive a 402 response with payment details, sign a transaction on Monad, and receive the skill execution result—all in milliseconds.

### 🛡️ Secure Sandboxing

Each skill runs in an isolated, ephemeral environment. This protects both the agent (from malicious code) and the skill host (from resource abuse).

### 🔍 Verified Registry

A decentralized registry on Monad ensures that skill metadata (name, description, endpoints) is immutable and verifiable. "Verified" badges indicate audited or trusted authors.

---

## 🏗️ How It Works

1. **Discovery**: An agent queries the SkillForge Registry (smart contract) to find a skill matching its needs (e.g., `pdf-research-pro`).
2. **Negotiation**: The agent calls the skill's endpoint. The server responds with `402 Payment Required` and a price (e.g., 0.05 MON).
3. **Payment**: The agent signs a transaction on the Monad blockchain paying the fee to the skill creator.
4. **Execution**: The payment proof (tx hash) is sent to the skill server. The server verifies the transaction and executes the code.
5. **Result**: The output (JSON) is returned to the agent.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4, Framer Motion
- **UI Components**: Lucide React
- **Blockchain**: Monad (Testnet/Devnet)
- **Web3 Integration**: Wagmi, Viem, RainbowKit
- **Storage**: IPFS (Pinata) for skill metadata
- **Protocol**: Model Context Protocol (MCP)

---

## 📜 Smart Contracts

The core of SkillForge is the **SkillRegistry** contract.

- **`registerSkill(name, metadataURI, price)`**: Registers a new skill.
- **`executeSkill(skillId)`**: Verifies payment/execution on-chain (optional, for non-optimistic settlement).
- **`updateSkill(...)`**: Allows creators to update pricing or versions.

*Contract addresses are available in `app/contracts/config.ts`.*

---

## 📦 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Package Manager**: npm, pnpm, or bun
- **Wallet**: Metamask or Rabbit (configured for Monad Testnet)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/skillforge.git
    cd skillforge
    ```

2. **Install dependencies:**

    ```bash
    pnpm install
    # or npm install
    ```

3. **Configure Environment:**
    Copy `.env.example` to `.env.local` and add your keys.

    ```bash
    cp .env.example .env.local
    ```

    *Required variables: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, `NEXT_PUBLIC_MONAD_RPC_URL`*

4. **Run Development Server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧩 Project Structure

```
skillforge/
├── app/
│   ├── api/                 # Next.js API Routes (mock skill execution)
│   ├── components/          # Reusable UI components (Navbar, Footer, etc.)
│   ├── dashboard/           # Creator dashboard (Register skills)
│   ├── marketplace/         # Skill discovery & purchase interface (with Read More description)
│   ├── skills/              # Individual skill details pages
│   ├── globals.css          # Global Tailwind styles
│   ├── layout.tsx           # Root layout & Web3 Providers
│   └── page.tsx             # Landing page
├── components/              # Shared components
├── contracts/               # ABI and Contract addresses
├── lib/
│   ├── hooks/               # Custom React hooks (useSkills, usePurchase)
│   └── utils.ts             # Helper functions
└── public/                  # Static assets (images, icons)
```

---

## 🤖 MCP Integration (Crucial)

To empower your AI agent (like Claude Desktop) with the entire SkillForge marketplace, add the following configuration to your `mcp_config.json`. This acts as a gateway, allowing your agent to dynamically discover and use any skill on the platform.

```json
{
  "mcpServers": {
    "skillforge": {
      "url": "https://skillforge-mcp.onrender.com/sse"
    }
  }
}
```

Once configured, restarting your agent will give it access to the `search_skills`, `get_skill_details`, and `execute_skill` tools.

---

## 🗺️ Roadmap

- [x] **Phase 1: Foundation** - Landing page, Design System, Basic Registry.
- [ ] **Phase 2: The Graph** - Indexing layer for advanced search and filtering.
- [ ] **Phase 3: Client SDK** - Python/Node.js SDKs for developers to wrap their tools.
- [ ] **Phase 4: Execution Node** - Decentralized Docker-based runtime for hosting skills.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to verify the `issues` page or submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
