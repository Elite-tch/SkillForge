'use client'
import React from "react";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Shield, Database, DollarSign, Lock, Server, Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";



const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5 bg-black pt-10 md:pt-20 pb-20">
    {/* Animated Background Layers */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Moving Grid */}
      <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffbd_1px,transparent_1px),linear-gradient(to_bottom,#00ffbd_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-scroll" />
      </div>

      {/* Scanning Light Bar */}
      <div className="absolute left-0 right-0 h-[30vh] bg-gradient-to-b from-transparent via-[#00ffbd]/5 to-transparent animate-scanline" />

      {/* Brand Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#00ffbd] opacity-[0.05] blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[#8247e5] opacity-[0.03] blur-[100px] rounded-full mix-blend-screen" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 mx-auto max-w-6xl px-4 text-center"
    >
      {/* Original Badge Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 inline-flex items-center gap-2 rounded-sm border border-[#00ffbd]/30 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00ffbd] backdrop-blur-md"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#00ffbd] animate-pulse shadow-[0_0_8px_#00ffbd]" />
        Agent Skill Marketplace
      </motion.div>

      {/* Original Main Headline with New Style */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl  font-display"
      >
        The agent economy <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#00ffbd] to-[#00ffbd]/70 drop-shadow-[0_0_15px_rgba(0,255,189,0.3)]">
          runs on code.
        </span>
      </motion.h1>

      {/* Original Description with New Style */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-slate-400"
      >
        SkillForge is a decentralized marketplace where AI agents discover and buy
        <span className="text-white"> MCP skills</span> via
        <span className="text-white"> HTTP 402</span> micropayments
        on <span className="text-[#00ffbd]"> Monad.</span>
      </motion.p>

      {/* Original CTAs Labels with New Style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Link href="/marketplace">
          <button className="group relative flex h-14 items-center justify-center gap-2 rounded-sm bg-[#00ffbd] px-8 text-sm font-black uppercase tracking-widest text-black transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-4px_4px_0_white] active:translate-x-0 active:translate-y-0 active:shadow-none">
            Initialize agent run <span className="text-lg">→</span>
          </button>
        </Link>
        <button className="h-14 rounded-sm border-2 border-[#00ffbd] bg-transparent px-8 text-sm font-black uppercase tracking-widest text-[#00ffbd] transition-all hover:bg-[#00ffbd]/10">
          View MCP config
        </button>
      </motion.div>

      {/* Technical Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-white/5 pt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500"
      >
        <div className="flex items-center gap-2 transition-colors hover:text-[#00ffbd]">
          <Shield className="h-3 w-3" />
          Verified Hash
        </div>
        <div className="flex items-center gap-2 transition-colors hover:text-[#00ffbd]">
          <Terminal className="h-3 w-3" />
          CLI Ready
        </div>
        <div className="flex items-center gap-2 transition-colors hover:text-[#8247e5]">
          <Database className="h-3 w-3" />
          Monad Settlement
        </div>
      </motion.div>
    </motion.div>
  </section>
);

const Features = () => {
  const items = [
    {
      title: "MCP-Native",
      desc: "Standards-compliant protocol for universal agent compatibility.",
      icon: Database,
    },
    {
      title: "HTTP 402",
      desc: "Built-in payment headers for seamless machine-to-machine commerce.",
      icon: DollarSign,
    },
    {
      title: "Sandboxed",
      desc: "Secure execution environments isolated from agent memory.",
      icon: Lock,
    },
    {
      title: "Monad Speed",
      desc: "10,000 TPS settlement layer for high-frequency micro-transactions.",
      icon: Server,
    },
  ];

  return (
    <section className="border-b border-white/5 bg-black py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl text-center font-semibold tracking-tight text-white font-display">
            Infrastructure for the <span className="text-[#8247e5]">Agent Age</span>
          </h2>
          <p className="mt-3 text-sm text-center text-slate-400 leading-relaxed">
            We provide the missing primitives to turn LLMs into economic actors.
            Standardized interfaces, instant payments, and verifiable execution.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/40 p-6 transition-all hover:bg-neutral-900/60 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8247e5]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white border border-white/10 group-hover:border-[#8247e5]/50 group-hover:text-[#8247e5] transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const McpConfig = () => (
  <section className="border-b border-white/5 bg-neutral-900/20 py-20 relative overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8247e5]/50 to-transparent" />

    <div className="mx-auto max-w-4xl px-4 text-center">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#8247e5]/30 bg-[#8247e5]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8247e5] mb-6">
          <Terminal className="h-3 w-3" />
          Developer Action Required
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-display mb-4">
          Enable SkillForge in your Agent
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          To give your AI assistant access to the entire marketplace, add this gateway configuration to your local MCP settings file.
        </p>
      </div>

      <div className="relative group text-left max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8247e5] to-[#00ffbd] opacity-20 blur group-hover:opacity-40 transition-opacity duration-500 rounded-xl" />
        <div className="relative rounded-xl border border-white/10 bg-black p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <span className="ml-3 text-xs font-mono text-slate-500">~/.config/Claude/mcp_config.json</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">JSON</div>
          </div>

          <pre className="font-mono text-xs md:text-sm text-slate-300 overflow-x-auto p-2">
            <code>
              <span className="text-slate-500">{`{`}</span>
              <span className="text-[#8247e5]">"mcpServers"</span>: <span className="text-slate-500">{`{`}</span>
              <span className="text-[#00ffbd]">"skillforge"</span>: <span className="text-slate-500">{`{`}</span>
              <span className="text-[#8247e5]">"url"</span>: <span className="text-yellow-300">"https://skillforge-mcp.onrender.com/sse"</span>
              <span className="text-slate-500">{`}`}</span>
              <span className="text-slate-500">{`}`}</span>
              <span className="text-slate-500">{`}`}</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  </section>
);

const Flow = () => (
  <section className="relative border-b border-white/5 bg-neutral-950 py-24 overflow-hidden">
    <div className="mx-auto max-w-6xl px-4 relative z-10">
      <div className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight text-white font-display">
          End-to-End Execution Flow
        </h2>
        <p className="mt-3 text-sm text-slate-400 max-w-xl">
          Observe a complete transaction cycle where an agent discovers, pays for, and utilizes a skill.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        {/* Timeline */}
        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
          {[
            {
              step: 1,
              title: "User Prompt",
              desc: "User asks agent to perform a complex task.",
              detail: '"Summarize these 50 PDFs and extract financial tables."'
            },
            {
              step: 2,
              title: "Discovery",
              desc: "Agent queries SkillForge registry for relevant tools.",
              detail: "Matches 'pdf-research-pro' (Rank: #1, Price: $0.05)"
            },
            {
              step: 3,
              title: "Payment",
              desc: "Agent signs HTTP 402 transaction on Monad.",
              detail: "0.05 USDC reserved in payment channel."
            },
            {
              step: 4,
              title: "Execution",
              desc: "Skill runs in secure sandbox environment.",
              detail: "Processing 50 files... Generating tables..."
            },
            {
              step: 5,
              title: "Settlement",
              desc: "Result delivered, payment settled instantly.",
              detail: "Agent receives JSON output. Creator receives payment."
            },
          ].map((item, i) => (
            <div key={i} className="relative flex gap-6 group">
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black text-xs font-bold text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-colors group-hover:border-[#00ffbd]/50 group-hover:text-[#00ffbd]">
                {item.step}
              </div>
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#00ffbd] transition-colors">{item.title}</h3>
                <p className="text-xs text-slate-400 mb-1">{item.desc}</p>
                <p className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded inline-block border border-white/5">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Log View */}
        <div className="relative h-full min-h-[400px]">
          <div className="sticky top-24 rounded-xl border border-white/10 bg-black shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900/50 px-4 py-3">
              <span className="text-xs font-mono text-slate-400">agent_runtime.log</span>
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              </div>
            </div>

            <div className="p-6 font-mono text-[11px] md:text-xs leading-loose">
              <div className="flex gap-3 opacity-50">
                <span className="text-slate-600">10:42:01</span>
                <span className="text-slate-300">System initialized. Listening for input...</span>
              </div>
              <div className="flex gap-3 border-l-2 border-[#8247e5] pl-3 my-2 bg-[#8247e5]/5 py-1">
                <span className="text-slate-500">10:42:05</span>
                <span className="text-white font-bold">&gt; User: Summarize 50 PDFs in /docs</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">10:42:06</span>
                <span className="text-[#00ffbd]">Thinking... Identify need for external tool.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">10:42:06</span>
                <span className="text-blue-400">Querying SkillForge Registry (tag: pdf-analysis)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">10:42:07</span>
                <span className="text-slate-300">Found: "pdf-research-pro" (v2.1) - Cost: 0.05 USDC</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">10:42:07</span>
                <span className="text-yellow-400">Initiating HTTP 402 Payment via Monad...</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">10:42:08</span>
                <span className="text-slate-400">Tx Hash: 0x8a7...3f2 (Confirmed in 0.4s)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600">10:42:08</span>
                <span className="text-[#00ffbd]">Executing Skill... [====================] 100%</span>
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-slate-600">10:42:12</span>
                <span className="text-white">Task Complete. Delivered summary.md (42kb).</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 bg-black py-12">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white font-bold">
          <Terminal className="h-4 w-4" />
          <span>SkillForge</span>
        </div>
        <p className="max-w-xs text-slate-400">
          The composable skill layer for autonomous agents.
          <br />Built on the high-performance Monad blockchain.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-white mb-1">Product</span>
          <Link href="#" className="hover:text-[#00ffbd] transition-colors">Marketplace</Link>
          <Link href="#" className="hover:text-[#00ffbd] transition-colors">SDK</Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-white mb-1">Resources</span>
          <Link href="#" className="hover:text-[#00ffbd] transition-colors">Documentation</Link>
          <Link href="#" className="hover:text-[#00ffbd] transition-colors">GitHub</Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-white mb-1">Company</span>
          <Link href="#" className="hover:text-[#00ffbd] transition-colors">About</Link>
          <Link href="#" className="hover:text-[#00ffbd] transition-colors">Careers</Link>
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-6xl px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="text-slate-600">© 2026 SkillForge Inc. All rights reserved.</span>
      <div className="flex items-center gap-4">
        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#8247e5]/30 selection:text-white">
      <Hero />
      <Features />
      <McpConfig />
      <Flow />
      <Footer />
    </main>
  );
}
