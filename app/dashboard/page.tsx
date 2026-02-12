"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard, Monitor, Package, Settings, Plus,
  BarChart, Wallet, LogOut, Terminal, Code2, Activity, MessageSquare, Check, Share2,
  GitCommit, DollarSign, Clock, Layout, Shield, Box, Star, Menu, X
} from "lucide-react";
import { mockSkills } from "../lib/mock-data";

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
  const [skills, setSkills] = useState(mockSkills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Analysis");

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const id = newSkillName.toLowerCase().replace(/\s+/g, "-");
    setSkills([
      ...skills,
      {
        id,
        name: newSkillName,
        shortDescription: "Custom mock skill added from dashboard.",
        longDescription:
          "This is a locally added mock skill. In a real deployment this would be created via an API call.",
        price: "$0.01",
        unit: "per call",
        chain: "Monad",
        category: newSkillCategory,
        rating: 5,
        callsToday: 0,
        image: "/assets/skill-pdf-research-pro.png",
      },
    ]);
    setNewSkillName("");
  };

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
            icon={Monitor}
            label="Activity Logs"
            active={activeTab === "logs"}
            onClick={() => setActiveTab("logs")}
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
                <StatCard title="Total Revenue" value="$842.50" sub="last 30 days" trend={12.5} />
                <StatCard title="API Calls" value="14.2k" sub="last 30 days" trend={8.2} />
                <StatCard title="Active Skills" value={String(skills.length)} sub="running on Monad" trend={0} />
                <StatCard title="Avg Latency" value="115ms" sub="global edge" trend={-2.4} />
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 rounded-xl border border-white/10 bg-neutral-900/30 p-6">
                  <h3 className="font-bold text-white mb-6">Recent Invocations</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-white/5 pb-3 text-sm last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-2 w-2 rounded-full ${i % 2 === 0 ? "bg-emerald-400" : "bg-blue-400"
                              }`}
                          />
                          <div>
                            <div className="text-white font-medium">pdf-research-pro</div>
                            <div className="text-xs text-slate-500">Agent: 0x71C...9A2</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-mono flex items-center gap-1">
                            +$0.05 <span className="text-[10px] text-slate-500">USDC</span>
                          </div>
                          <div className="text-[10px] text-slate-500">2 mins ago</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deployment Status */}
                <div className="rounded-xl border border-white/10 bg-neutral-900/30 p-6">
                  <h3 className="font-bold text-white mb-6">System Status</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400">Sandbox Utilization</span>
                        <span className="text-white">42%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[42%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400">Monad RPC Health</span>
                        <span className="text-emerald-400">Operational</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full animate-pulse" />
                      </div>
                    </div>
                    <div className="p-3 rounded bg-white/5 border border-white/5 text-xs text-slate-400 mt-4">
                      <span className="text-yellow-400 font-bold block mb-1">Update Available</span>
                      Client SDK v1.0.5 is now available. Update your agent config to access new payment channels.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Managed Skills</h3>
                <span className="text-xs text-slate-500">
                  Registered capabilities currently live on the network.
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-900/40 px-4 py-3"
                  >
                    <div>
                      <div className="font-medium text-white">{skill.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {skill.category} • {skill.price} {skill.unit}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>{skill.callsToday} calls today</div>
                      <div>{skill.rating.toFixed(1)} rating</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-emerald-500/40 bg-neutral-900/40 p-4">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Plus className="h-3 w-3" /> Add new capability
                </h4>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Skill name (e.g., CSV Cleaner)"
                    className="flex-1 rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-slate-100 focus:border-emerald-500/60 focus:outline-none"
                  >
                    <option>Analysis</option>
                    <option>Language</option>
                    <option>Legal</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
                  >
                    Deploy Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "overview" && activeTab !== "skills" && (
            <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-12 text-center text-sm text-slate-400 italic">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
