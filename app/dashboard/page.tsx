"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard, Monitor, Package, Settings, Plus,
  BarChart, Wallet, LogOut, Terminal, Code2, Activity, MessageSquare, Check, Share2,
  GitCommit, DollarSign, Clock, Layout, Shield, Box, Star, Menu, X, Loader2, CheckCircle, AlertCircle
} from "lucide-react";
import { mockSkills } from "../lib/mock-data";
import { useRegisterSkill } from "../lib/hooks/useRegisterSkill";
import { useMySkills } from "../lib/hooks/useMySkills";
import { useWithdraw } from "../lib/hooks/useWithdraw";
import { formatEther } from "viem";

type Tab = "overview" | "skills" | "logs" | "earnings" | "settings";

const SidebarLink = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

const StatCard = ({ title, value, sub, trend }: any) => (
  <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-6">
    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="flex items-center gap-2 text-xs">
      <span className={trend > 0 ? "text-emerald-400" : "text-red-400"}>
        {trend > 0 ? "+" : ""}{trend}%
      </span>
      <span className="text-slate-500">{sub}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Blockchain hooks
  const { skills: mySkills, isLoading: loadingSkills } = useMySkills();
  const { balance, balanceFormatted, withdraw, isPending: isWithdrawing, isSuccess: withdrawSuccess } = useWithdraw();
  const { registerSkill, isPending: isRegistering, isSuccess: registerSuccess, hash } = useRegisterSkill();

  // Form state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Analysis");
  const [newSkillTags, setNewSkillTags] = useState("");
  const [newSkillPrice, setNewSkillPrice] = useState("");
  const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);

  const handleRegisterSkill = async () => {
    if (!newSkillName || !newSkillDescription || !newSkillPrice) {
      alert("Please fill in name, description, and price");
      return;
    }

    try {
      setIsUploadingToIPFS(true);

      // Upload metadata to IPFS via Pinata
      const ipfsResponse = await fetch('/api/ipfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSkillName,
          description: newSkillDescription,
          category: newSkillCategory,
          tags: newSkillTags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (!ipfsResponse.ok) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      const { ipfsUrl } = await ipfsResponse.json();
      setIsUploadingToIPFS(false);

      // Register skill on-chain with IPFS URL
      await registerSkill(newSkillPrice, ipfsUrl);
    } catch (error) {
      console.error("Failed to register skill:", error);
      setIsUploadingToIPFS(false);
      alert(error instanceof Error ? error.message : "Registration failed");
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw();
    } catch (error) {
      console.error("Failed to withdraw:", error);
      alert(error instanceof Error ? error.message : "Withdrawal failed");
    }
  };

  // Reset form on success
  React.useEffect(() => {
    if (registerSuccess) {
      setNewSkillName("");
      setNewSkillDescription("");
      setNewSkillCategory("Analysis");
      setNewSkillTags("");
      setNewSkillPrice("");
    }
  }, [registerSuccess]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#8247e5]/30 flex">
      {/* Mobile Nav Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#8247e5] text-white shadow-lg md:hidden"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-black p-6 transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Sidebar content starts with space for global navbar */}
        <div className="mt-4 space-y-2 flex-1">
          <SidebarLink
            icon={BarChart}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarLink
            icon={Package}
            label="My Skills"
            active={activeTab === "skills"}
            onClick={() => setActiveTab("skills")}
          />
          <SidebarLink
            icon={Wallet}
            label="Earnings"
            active={activeTab === "earnings"}
            onClick={() => setActiveTab("earnings")}
          />
          <SidebarLink
            icon={Settings}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>

        <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors mt-auto">
          <LogOut className="h-3 w-3" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="border-b border-white/10 h-16 flex items-center justify-between px-8 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
          <h2 className="font-semibold text-white capitalize">
            {activeTab === "overview" ? "Dashboard" : activeTab.replace(/^\w/, (c) => c.toUpperCase())}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("skills")}
              className="bg-[#8247e5] hover:bg-[#7038d4] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Plus className="h-3 w-3" /> Deploy New Skill
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20" />
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Earnings" value={`${balanceFormatted} MON`} sub="on-chain" trend={0} />
                <StatCard title="Registered Skills" value={String(mySkills?.length || 0)} sub="on Monad" trend={0} />
                <StatCard title="Active Skills" value={String(mySkills?.filter(s => s.isActive).length || 0)} sub="running" trend={0} />
                <StatCard title="Network" value="Monad" sub="testnet" trend={0} />
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("skills")}
                    className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Register New Skill</div>
                        <div className="text-xs text-slate-500">Deploy to blockchain</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("earnings")}
                    className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Withdraw Earnings</div>
                        <div className="text-xs text-slate-500">{balanceFormatted} MON available</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">My Registered Skills</h3>
                <span className="text-xs text-slate-500">
                  {mySkills?.length || 0} skills on-chain
                </span>
              </div>

              {/* Loading State */}
              {loadingSkills && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  <span className="ml-3 text-sm text-slate-400">Loading your skills...</span>
                </div>
              )}

              {/* Skills List */}
              {!loadingSkills && mySkills && mySkills.length > 0 && (
                <div className="space-y-2 text-sm">
                  {mySkills.map((skill) => (
                    <div
                      key={skill.skillId.toString()}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-900/40 px-4 py-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white">{skill.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {skill.description.substring(0, 60)}{skill.description.length > 60 ? '...' : ''}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-600">
                            {formatEther(skill.pricePerUse ?? BigInt(0))} MON per use
                          </span>
                          <span className="text-[10px] text-slate-600">•</span>
                          <span className="text-[10px] text-slate-600">
                            {(skill.totalCalls ?? BigInt(0)).toString()} total calls
                          </span>
                          <span className="text-[10px] text-slate-600">•</span>
                          <span className={`text-[10px] ${skill.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {skill.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/skills/blockchain-${skill.skillId}`}
                        className="text-xs text-purple-400 hover:text-purple-300 ml-4"
                      >
                        View →
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loadingSkills && (!mySkills || mySkills.length === 0) && (
                <div className="rounded-lg border border-white/10 bg-neutral-900/40 p-8 text-center">
                  <p className="text-slate-400">No skills registered yet</p>
                  <p className="text-xs text-slate-600 mt-2">Register your first skill below</p>
                </div>
              )}

              {/* Registration Form */}
              <div className="mt-6 rounded-xl border border-dashed border-emerald-500/40 bg-neutral-900/40 p-6">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Register New Skill
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-2">Skill Name *</label>
                      <input
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g., PDF Research Pro"
                        className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-2">Category</label>
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-slate-100 focus:border-emerald-500/60 focus:outline-none"
                      >
                        <option>Analysis</option>
                        <option>Language</option>
                        <option>Data</option>
                        <option>Security</option>
                        <option>Creative</option>
                        <option>Social</option>
                        <option>DevTools</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Description *</label>
                    <textarea
                      value={newSkillDescription}
                      onChange={(e) => setNewSkillDescription(e.target.value)}
                      placeholder="Describe what your skill does..."
                      rows={5}
                      className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Tags (comma-separated)</label>
                    <input
                      value={newSkillTags}
                      onChange={(e) => setNewSkillTags(e.target.value)}
                      placeholder="OCR, Finance, PDF"
                      className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Price per Use (MON) *</label>
                    <input
                      value={newSkillPrice}
                      onChange={(e) => setNewSkillPrice(e.target.value)}
                      placeholder="0.05"
                      type="number"
                      step="0.001"
                      className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleRegisterSkill}
                    disabled={isRegistering || isUploadingToIPFS || !newSkillName || !newSkillDescription || !newSkillPrice}
                    className="w-full rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploadingToIPFS ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading to IPFS...
                      </>
                    ) : isRegistering ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Registering on-chain...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Register Skill
                      </>
                    )}
                  </button>

                  {/* Success Message */}
                  {registerSuccess && hash && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-emerald-400 font-medium">Skill registered successfully!</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono break-all">
                          TX: {hash.slice(0, 10)}...{hash.slice(-8)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
                <h3 className="font-bold text-white mb-6">Your Earnings</h3>

                <div className="bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-lg p-6 mb-6">
                  <div className="text-sm text-slate-400 mb-2">Available Balance</div>
                  <div className="text-4xl font-bold text-white mb-1">{balanceFormatted} MON</div>
                  <div className="text-xs text-slate-500">On Monad Testnet</div>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || balance === BigInt(0)}
                  className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Withdrawal...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      Withdraw to Wallet
                    </>
                  )}
                </button>

                {withdrawSuccess && (
                  <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-emerald-400 font-medium">Withdrawal successful!</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Funds transferred to your wallet
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-12 text-center text-sm text-slate-400 italic">
              Settings Coming Soon
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
