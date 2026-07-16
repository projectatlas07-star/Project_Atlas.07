"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import AskAtlas from "@/components/intelligence/AskAtlas";
import BusinessInsights from "@/components/intelligence/BusinessInsights";
import Recommendations from "@/components/intelligence/Recommendations";
import LearningStats from "@/components/intelligence/LearningStats";

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<
    "ask" | "insights" | "recommendations" | "learning"
  >("ask");

  const tabs = [
    { id: "ask" as const, label: "Ask Atlas", icon: "🤖" },
    { id: "insights" as const, label: "Insights", icon: "📊" },
    { id: "recommendations" as const, label: "Recommendations", icon: "💡" },
    { id: "learning" as const, label: "Learning", icon: "🧠" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="text-4xl">🧠</div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Atlas Intelligence
          </h1>
          <p className="text-muted-foreground">
            AI Operating System for Insurance Restoration
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "ask" && <AskAtlas />}
      {activeTab === "insights" && <BusinessInsights />}
      {activeTab === "recommendations" && <Recommendations />}
      {activeTab === "learning" && <LearningStats />}
    </div>
  );
}
