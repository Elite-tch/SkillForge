'use client'

import React from "react";
import Link from "next/link";
import {
    ArrowLeft, Star, Share2, Shield, Zap, Box,
    Terminal, Code2, Activity, MessageSquare,
    GitCommit, DollarSign, Clock, Layout, Check
} from "lucide-react";

// Mock Data (matches marketplace list)
const skills: Record<string, any> = {
    "pdf-research-pro": {
        name: "PDF Research Pro",
        slug: "pdf-research-pro",
        description: "Extracts tables, summaries, and key insights from PDF documents. Handles scanned files via OCR.",
        fullDescription: "An industrial-grade PDF extraction engine designed for AI agents. Unlike standard text extractors, this skill uses a vision-language model to understand document layout, extracting tables into structured CSVs and summarizing sections based on semantic relevance. Perfect for legal discovery, financial analysis, and academic research.",
        price: "$0.05",
        unit: "per page",
        rating: 4.9,
        reviews: 128,
        tags: ["Analysis", "OCR", "Finance"],
        verified: true,
        author: "DataMind AI",
        version: "2.1.0",
        lastUpdated: "2 days ago",
        installCount: "12.4k",
        image: "/forge1.png",
        endpoints: [
            { method: "POST", path: "/analyze", desc: "Upload PDF buffer for analysis" },
            { method: "GET", path: "/status/:id", desc: "Check processing status" }
        ]
    },
    "tech-translate-specialist": {
        name: "TechTranslate Specialist",
        slug: "tech-translate-specialist",
        description: "High-precision translation for technical documentation. Preserves code blocks and markdown.",
        fullDescription: "Translation is easy; translating technical docs without breaking code blocks is hard. This skill is fine-tuned on 10M+ lines of documentation to ensure that while the comments change language, the variables and logic remain untouched.",
        price: "$0.02",
        unit: "per 1k tokens",
        rating: 4.7,
        reviews: 84,
        tags: ["Translation", "DevTools"],
        verified: true,
        author: "GlobalDev",
        version: "1.0.4",
        lastUpdated: "1 week ago",
        installCount: "3.2k",
        image: "/forge2.png",
        endpoints: [
            { method: "POST", path: "/translate", desc: "Translate markdown content" }
        ]
    },
    "web-scraper-v2": {
        name: "Universal Web Scraper",
        slug: "web-scraper-v2",
        description: "Ethical scraping agent that handles JS-heavy sites, CAPTCHAs, and returns structured JSON.",
        fullDescription: "A headless browser service optimized for data extraction. It automatically handles CAPTCHA solving, IP rotation, and JavaScript rendering to deliver clean, structured JSON from any URL. Complies with robots.txt by default unless overridden.",
        price: "$0.10",
        unit: "per site",
        rating: 4.8,
        reviews: 340,
        tags: ["Data", "Web"],
        verified: false,
        author: "SpiderData",
        version: "2.0.1",
        lastUpdated: "3 days ago",
        installCount: "45.1k",
        image: "/forge.png",
        endpoints: [
            { method: "POST", path: "/scrape", desc: "Scrape URL and return JSON" },
            { method: "POST", path: "/screenshot", desc: "Capture full-page screenshot" }
        ]
    },
    "smart-contract-auditor": {
        name: "Solidity Auditor",
        slug: "smart-contract-auditor",
        description: "Static analysis and vulnerability detection for EVM smart contracts.",
        fullDescription: "Automated security auditing for Solidity smart contracts. Detects reentrancy, overflow/underflow, gas optimization issues, and common vulnerabilities using symbolic execution and static analysis. Integrated with Monad development workflows.",
        price: "$1.50",
        unit: "per audit",
        rating: 5.0,
        reviews: 42,
        tags: ["Security", "Blockchain", "Monad"],
        verified: true,
        author: "SecureChain",
        version: "1.2.0",
        lastUpdated: "5 days ago",
        installCount: "890",
        image: "/forge1.png",
        endpoints: [
            { method: "POST", path: "/audit", desc: "Submit source code for audit" }
        ]
    },
    "image-gen-flux": {
        name: "Flux Image Gen",
        slug: "image-gen-flux",
        description: "Generate photorealistic images using the Flux model. Optimized for speed on Monad.",
        fullDescription: "High-performance image generation API powered by the Flux model. specialized for photorealism and complex prompt adherence. Renders 1024x1024 images in under 2 seconds. Supports negative prompts and seed control.",
        price: "$0.08",
        unit: "per image",
        rating: 4.6,
        reviews: 110,
        tags: ["Creative", "Image"],
        verified: true,
        author: "CreativeOps",
        version: "0.9.5",
        lastUpdated: "1 day ago",
        installCount: "8.5k",
        image: "/forge2.png",
        endpoints: [
            { method: "POST", path: "/generate", desc: "Generate image from text" }
        ]
    },
    "twitter-sentiment": {
        name: "X/Twitter Sentiment",
        slug: "twitter-sentiment",
        description: "Real-time sentiment analysis of stock/crypto tickers on X.",
        fullDescription: "Monitor social sentiment in real-time. This skill connects to the X firehose to analyze distinct sentiment (bullish/bearish) for specific cashtags ($BTC, $MONAD). Returns a normalized sentiment score between -1 and 1.",
        price: "$0.01",
        unit: "per query",
        rating: 4.5,
        reviews: 215,
        tags: ["Social", "Finance"],
        verified: false,
        author: "MarketPulse",
        version: "3.1.0",
        lastUpdated: "12 hours ago",
        installCount: "15.3k",
        image: "/forge.png",
        endpoints: [
            { method: "GET", path: "/analyze", desc: "Get sentiment for query" }
        ]
    },
    // Fallback for others
    "default": {
        name: "Generic Utility Skill",
        slug: "generic-skill",
        description: "A general purpose utility skill for AI agents.",
        fullDescription: "This is a standard utility skill available on the SkillForge marketplace. It provides reliable execution for common agent tasks. Please refer to the specific documentation for this skill ID for more details.",
        price: "-",
        unit: "per call",
        rating: 0,
        reviews: 0,
        tags: ["Utility"],
        verified: false,
        author: "Community",
        version: "1.0.0",
        lastUpdated: "Unknown",
        installCount: "-",
        image: "/forge.png",
        endpoints: [
            { method: "POST", path: "/execute", desc: "Execute skill function" }
        ]
    }
};

export default function SkillDetail({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = React.use(params);
    const skill = skills[resolvedParams.slug] || skills["default"];
    const [isInstalling, setIsInstalling] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);

    const handleInstall = () => {
        setIsInstalling(true);
        // Simulate Monad transaction
        setTimeout(() => {
            setIsInstalling(false);
            setShowSuccess(true);
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#00ffbd]/30">

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-sm border border-[#00ffbd]/30 bg-neutral-900 p-8 text-center shadow-[0_0_50px_rgba(0,255,189,0.1)]">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00ffbd]/10 text-[#00ffbd]">
                            <Check className="h-8 w-8" />
                        </div>
                        <h3 className="mb-2 text-xl font-black uppercase tracking-tight">Access Granted</h3>
                        <p className="mb-6 text-sm text-slate-400">
                            Capability <span className="text-white font-bold">{skill.name}</span> has been registered to your agent's API registry via Monad settlement.
                        </p>
                        <div className="mb-6 rounded-sm bg-black/40 p-3 font-mono text-[10px] text-slate-500 border border-white/5">
                            TX: 0x5a8...f2e9
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full rounded-sm bg-[#00ffbd] py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-white transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-5xl px-4 py-12">
                {/* Header Section */}
                <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Skill Image */}
                        <div className="md:h-32 md:w-32 max-h-80 rounded-sm overflow-hidden border border-white/10 shadow-2xl shadow-[#00ffbd]/10 bg-neutral-900 shrink-0">
                            <img
                                src={skill.image}
                                alt={skill.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 border border-white/5">
                                MCP-Native Skill
                            </div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-white font-display mb-3 flex items-center gap-3">
                                {skill.name}
                                {skill.verified && <Shield className="h-6 w-6 text-[#00ffbd]" />}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                                    <Box className="h-4 w-4 text-[#00ffbd]" /> {skill.author}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    v{skill.version}
                                </span>
                                <span className="flex items-center gap-1.5 text-yellow-500/80">
                                    <Star className="h-4 w-4 fill-current text-yellow-500" /> {skill.rating}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[220px]">
                        <button
                            onClick={handleInstall}
                            disabled={isInstalling}
                            className="group relative flex h-14 items-center justify-center gap-3 rounded-sm bg-[#00ffbd] px-6 text-sm font-black uppercase tracking-widest text-black transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-4px_4px_0_white] disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none"
                        >
                            {isInstalling ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                    Settling...
                                </>
                            ) : (
                                <>Purchase Access</>
                            )}
                        </button>
                        <div className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                            HTTP 402 Micropayment Required
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#00ffbd] mb-6">Technical Architecture</h2>
                            <p className="text-slate-400 leading-relaxed text-sm lg:text-md">
                                {skill.fullDescription}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#00ffbd] mb-6">Integration Pipeline</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { step: "01", title: "Authorize", desc: "Settle 402 payment on Monad" },
                                    { step: "02", title: "Config", desc: "Inject skill ID into MCP registry" },
                                    { step: "03", title: "Invoke", desc: "Execute via standard JSON-RPC" },
                                ].map((item) => (
                                    <div key={item.step} className="rounded-sm border border-white/5 bg-white/5 p-4 text-center">
                                        <div className="text-[10px] font-black text-slate-600 mb-1">{item.step}</div>
                                        <div className="text-xs font-bold text-white mb-2">{item.title}</div>
                                        <div className="text-[10px] text-slate-500 leading-tight">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#00ffbd] mb-6">REST Endpoints</h2>
                            <div className="rounded-sm border border-white/5 bg-neutral-900/50 overflow-hidden">
                                {skill.endpoints && skill.endpoints.map((ep: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0 font-mono text-xs">
                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-black ${ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#00ffbd]/10 text-[#00ffbd]'}`}>
                                            {ep.method}
                                        </span>
                                        <span className="text-slate-300 font-bold">{ep.path}</span>
                                        <span className="text-slate-500 ml-auto hidden sm:block italic">{ep.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#00ffbd] mb-6">Agent Implementation</h2>
                            <div className="rounded-sm border border-white/5 bg-black p-6 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                    <span className="text-slate-600 tracking-widest text-[10px] uppercase">main.ts</span>
                                    <div className="flex gap-1">
                                        <div className="h-2 w-2 rounded-full bg-white/10" />
                                        <div className="h-2 w-2 rounded-full bg-white/10" />
                                    </div>
                                </div>
                                <span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> MCPClient({'{'} <br />
                                &nbsp;&nbsp;<span className="text-blue-400">skill</span>: <span className="text-[#00ffbd]">"{skill.slug}"</span>, <br />
                                &nbsp;&nbsp;<span className="text-blue-400">auth</span>: <span className="text-[#00ffbd]">"bearer_monad_settled"</span> <br />
                                {'}'});<br />
                                <span className="text-purple-400">await</span> client.connect(); <br />
                                <span className="text-slate-500 mt-2 block">// Capability ready for agent invocation</span>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Pricing</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold text-white">{skill.price}</span>
                                <span className="text-sm text-slate-500">{skill.unit}</span>
                            </div>
                            <div className="text-xs text-slate-400 mb-6">
                                Billed instantly via HTTP 402 on Monad.
                            </div>
                            <div className="h-px bg-white/10 mb-6" />

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Daily Calls</span>
                                    <span className="text-white font-mono">1,240</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Latency</span>
                                    <span className="text-white font-mono">~120ms</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-2"><GitCommit className="h-3.5 w-3.5" /> Last Update</span>
                                    <span className="text-white font-mono">{skill.lastUpdated}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-2"><Layout className="h-3.5 w-3.5" /> Installs</span>
                                    <span className="text-white font-mono">{skill.installCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Reviews</h3>
                            <p className="text-xs text-slate-400 italic">"This skill saved us 40 hours of manual data entry last week. Seamless integration."</p>
                            <div className="mt-4 flex items-center gap-2 text-xs">
                                <div className="h-6 w-6 rounded-full bg-blue-500/20" />
                                <span className="text-slate-300 font-bold">Alex (Dev)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
