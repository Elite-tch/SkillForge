SkillForge

The Agent Skill Economy on Monad

SkillForge is a decentralized marketplace that enables AI agents to autonomously discover, purchase, and execute Model Context Protocol (MCP) skills using HTTP 402 micropayments.

Built for the Moltiverse Hackathon on the Monad blockchain.

🚀 Vision

SkillForge is building the missing economic layer for the Agentic Web.

Instead of hard-coding tools into every agent, SkillForge provides real-time, on-demand access to a global registry of agent capabilities.

Why SkillForge

For AI Agents
Agents gain infinite extensibility. If an agent needs to scrape a website, analyze a PDF, or deploy a smart contract, it can rent the skill instantly for a micro-fee.

For Skill Creators
Developers can monetize their code. Publish a simple Python or TypeScript function and earn crypto every time an AI agent uses it.

For Monad
SkillForge drives high-frequency, low-latency transactions through machine-to-machine commerce.

✨ Key Features

🛍️ MCP-Native Marketplace
Publish, version, and document skills following the Model Context Protocol standard.

⚡ HTTP 402 Micropayments
Pay-per-use skill invocation with instant settlement on Monad.

🛡️ Secure Sandboxing
Each skill runs in an isolated environment to protect both agents and hosts.

🔌 One-Line Integration
Works with any MCP-compliant agent like Claude Desktop, Goose, or custom agent swarms.

🛠️ Tech Stack

Framework: Next.js 15 (App Router)

Styling: Tailwind CSS v4

UI Components: Lucide React, Framer Motion

Typography: Inter, Outfit, Fira Code

Design System: Industrial AI aesthetic, dark mode, glassmorphism, Monad purple and cyan accents

Blockchain: Monad (Testnet and Devnet)

📦 Getting Started
Prerequisites

Node.js 18 or higher

npm or pnpm

Installation

Clone the repository

git clone https://github.com/yourusername/skillforge.git
cd skillforge


Install dependencies

npm install
# or
pnpm install


Set up environment variables

Copy the example file:

cp .env.example .env.local


Add your Monad RPC URL and other configuration values.

Run the development server

npm run dev


Open http://localhost:3000
 in your browser.

🧩 Project Structure
skillforge/
├── app/                 # Next.js App Router
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout, fonts, providers
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components
├── lib/                 # Utility functions
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
└── ...

🤖 MCP Configuration Example

To connect an agent to SkillForge, add the following to your mcp_config.json:

{
  "mcpServers": {
    "skillforge": {
      "url": "https://skillforge-mcp.onrender.com/sse"
    }
  }
}

{
  "mcpServers": {
    "skillforge": {
      "command": "npx",
      "args": ["-y", "@skillforge/mcp-client"],
      "env": {
        "SKILLFORGE_API_KEY": "sk_live_...",
        "SKILLFORGE_WALLET": "0x...",
        "SKILLFORGE_CHAIN": "monad"
      }
    }
  }
}

🗺️ Roadmap

 Phase 1. Foundation
Landing page, design system, 

 Phase 2. Skill Registry
Smart contracts on Monad

 Phase 3. Client SDK
Node and Python SDK for HTTP 402 negotiation

 Phase 4. Execution Node
Sandboxed runtime for hosting skills

🤝 Contributing

Contributions are welcome.

Fork the project

Create your feature branch

git checkout -b feature/AmazingFeature


Commit your changes

git commit -m "Add AmazingFeature"


Push to the branch

git push origin feature/AmazingFeature


Open a Pull Request

📄 License

Distributed under the MIT License.
See LICENSE for more information.
