"use client"

import React from "react";
import Link from "next/link";
import { Search, Filter, Star, Zap, Shield, ChevronRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useSkills } from "../lib/hooks/useSkills";
import { usePurchaseSkill } from "../lib/hooks/usePurchaseSkill";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [purchasingSkillId, setPurchasingSkillId] = React.useState<number | null>(null);
  const [executionStatus, setExecutionStatus] = React.useState<{ skillId: number; status: string; result?: any } | null>(null);

  const { address } = useAccount();
  const { purchaseSkill, hash, transactionId, isPending, isSuccess, error: purchaseError } = usePurchaseSkill();

  // Fetch skills from blockchain with metadata
  const { skills: enrichedSkills, isLoading, error } = useSkills();

  const categories = ["All", "Analysis", "Language", "Data", "Security", "Creative", "Social"];

  // Convert skills to display format
  const skills = React.useMemo(() => {
    if (!enrichedSkills) return [];

    return enrichedSkills.map((skill: any, index: number) => ({
      id: Number(skill.skillId),
      name: skill.name,
      slug: `skill-${skill.skillId}`,
      description: skill.description,
      price: `${formatEther(skill.pricePerUse)} MON`,
      unit: "per use",
      rating: 4.5 + (index % 5) * 0.1, // Mock rating for now
      reviews: 10 + (index * 15), // Mock reviews
      tags: skill.tags && skill.tags.length > 0 ? skill.tags : ["Blockchain"],
      verified: skill.isActive,
      creator: `${skill.creator.slice(0, 6)}...${skill.creator.slice(-4)}`,
      totalCalls: Number(skill.totalCalls),
      isActive: skill.isActive,
      image: skill.image || `/forge${(index % 3) + 1}.png`,
      priceInWei: skill.pricePerUse,
    }));
  }, [enrichedSkills]);

  // Handle automatic execution after successful purchase
  React.useEffect(() => {
    async function executeSkill() {
      if (isSuccess && transactionId && purchasingSkillId && address) {
        setExecutionStatus({ skillId: purchasingSkillId, status: 'executing' });

        try {
          const response = await fetch('/api/skills/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId,
              skillId: purchasingSkillId,
              userAddress: address,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            setExecutionStatus({ skillId: purchasingSkillId, status: 'success', result });
          } else {
            setExecutionStatus({ skillId: purchasingSkillId, status: 'error', result });
          }
        } catch (error) {
          console.error('Execution failed:', error);
          setExecutionStatus({ skillId: purchasingSkillId, status: 'error' });
        }
      }
    }

    executeSkill();
  }, [isSuccess, transactionId, purchasingSkillId, address]);

  const handlePurchase = async (skillId: number, priceInWei: bigint) => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setPurchasingSkillId(skillId);
    setExecutionStatus(null);

    try {
      await purchaseSkill(skillId, priceInWei);
    } catch (error) {
      console.error('Purchase failed:', error);
      setPurchasingSkillId(null);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || skill.tags.includes(activeCategory);
    return matchesSearch && matchesCategory && skill.isActive; // Only show active skills
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#00ffbd]/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white font-display">Discover Skills</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Browse the decentralized registry of MCP capabilities on Monad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search capabilities by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-sm border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-[#00ffbd] focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                ? "bg-[#00ffbd] text-black border border-[#00ffbd]"
                : "text-slate-500 border border-white/5 bg-white/5 hover:border-white/20 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#00ffbd]" />
            <span className="ml-3 text-slate-400">Loading skills from blockchain...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">Failed to load skills from blockchain</p>
            <p className="mt-2 text-sm text-slate-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && skills.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-neutral-900/20 p-12 text-center">
            <p className="text-slate-400">No skills registered on the blockchain yet</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-sm text-[#00ffbd] hover:underline"
            >
              Be the first to register a skill →
            </Link>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && filteredSkills.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill: any) => {
              const isPurchasing = purchasingSkillId === skill.id && isPending;
              const isExecuting = executionStatus && executionStatus.skillId === skill.id && executionStatus.status === 'executing';
              const isCompleted = executionStatus && executionStatus.skillId === skill.id && executionStatus.status === 'success';
              const hasFailed = (purchasingSkillId === skill.id && purchaseError) ||
                (executionStatus && executionStatus.skillId === skill.id && executionStatus.status === 'error');

              return (
                <div
                  key={skill.id}
                  className="group relative flex flex-col overflow-hidden rounded-sm border border-white/5 bg-neutral-900/20 transition-all hover:border-[#00ffbd]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8247e5]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />

                  {/* Card Image */}
                  <div className="relative h-64 w-full overflow-hidden bg-neutral-800">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="h-full w-full object-cover opacity-90 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="relative z-10 flex h-fit flex-col p-5">
                    <div className="mb-3 flex items-start justify-between">
                      {skill.verified && (
                        <div className="rounded-full bg-[#00ffbd]/10 px-2 py-0.5 text-[10px] font-medium text-[#00ffbd] border border-[#00ffbd]/20 flex items-center gap-1 backdrop-blur-md bg-black/40">
                          <Shield className="h-3 w-3" />
                          Active
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                    <p className="text-xs text-slate-500 mb-1">
                      Creator: {skill.creator}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      {skill.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {skill.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase font-mono bg-white/5 px-2 py-1 rounded text-slate-500 border border-white/5">
                          {tag}
                        </span>
                      ))}
                      <span className="text-[10px] uppercase font-mono bg-purple-500/10 px-2 py-1 rounded text-purple-400 border border-purple-500/20">
                        {skill.totalCalls} uses
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mb-4">
                      <div className="flex items-center gap-1 text-xs text-slate-300">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="font-bold">{skill.rating}</span>
                        <span className="text-slate-600">({skill.reviews})</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{skill.price}</div>
                        <div className="text-[10px] text-slate-500">{skill.unit}</div>
                      </div>
                    </div>

                    {/* Purchase Button (Read Only) */}
                    <button
                      disabled={true}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm font-bold text-sm transition-all bg-white/5 text-slate-500 border border-white/10 cursor-default"
                    >
                      <Shield className="h-4 w-4" />
                      Add SKillForge to your CLI
                    </button>

                    {/* Transaction Hash */}
                    {hash && purchasingSkillId === skill.id && (
                      <div className="mt-2 text-xs text-slate-500">
                        <a
                          href={`https://monad-testnet.socialscan.io/tx/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#00ffbd] underline"
                        >
                          View transaction →
                        </a>
                      </div>
                    )}

                    {/* Execution Result */}
                    {executionStatus && executionStatus.skillId === skill.id && executionStatus.result && (
                      <div className="mt-2 p-3 rounded border border-white/10 bg-black/40">
                        <p className="text-xs font-bold text-white mb-1">Execution Result:</p>
                        <pre className="text-[10px] text-slate-400 overflow-auto">
                          {JSON.stringify(executionStatus.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && skills.length > 0 && filteredSkills.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-neutral-900/20 p-12 text-center">
            <p className="text-slate-400">No skills match your search</p>
          </div>
        )}
      </div>
    </main>
  );
}
