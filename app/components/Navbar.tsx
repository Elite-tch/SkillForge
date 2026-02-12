import React from "react";
import Link from "next/link";
import { Terminal, ArrowUpRight, ArrowLeft, Wallet } from "lucide-react";

interface NavbarProps {
    backLink?: { href: string; label: string };
    showDeck?: boolean;
}

export function Navbar({ backLink, showDeck = false }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* Left Section: Logo */}
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-[#00ffbd] text-[#00ffbd] shadow-[0_0_10px_rgba(0,255,189,0.2)]">
                            <Terminal className="h-5 w-5" />
                        </div>
                        <span className="font-display text-xl font-black uppercase tracking-tighter text-white uppercase">SkillForge</span>
                    </Link>

                    {/* Desktop Navigation Links - Restored Original Labels */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/marketplace" className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-[#00ffbd]">Marketplace</Link>
                        <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-[#00ffbd]">Creators</Link>
                    </div>
                </div>

                {/* Right Section: Status & Connect */}
                <div className="flex items-center gap-6">
                    {backLink && (
                        <Link href={backLink.href} className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                            <ArrowLeft className="h-3 w-3" />
                            {backLink.label}
                        </Link>
                    )}

                    <div className="hidden sm:flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00ffbd] animate-pulse shadow-[0_0_8px_#00ffbd]" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">System Online</span>
                    </div>

                    <button className="group relative flex h-10 items-center justify-center gap-3 rounded-sm bg-[#00ffbd] px-6 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[-2px_2px_0_white] active:translate-x-0 active:translate-y-0 active:shadow-none">
                        <Wallet className="h-4 w-4" />
                        Connect
                    </button>
                </div>
            </div>
        </nav>
    );
}
