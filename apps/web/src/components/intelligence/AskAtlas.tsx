"use client";

import { useState } from "react";
import { Button, Input } from "@project-atlas/ui";
import { apiFetch } from "@/lib/api";
import { AlertCircle, Lightbulb } from "lucide-react";

interface QueryResult {
  answer: string;
  reasoning: string;
  statistics: Record<string, number | string>;
  supportingRecords: Array<{
    id: string;
    type: string;
    description: string;
    value?: number;
  }>;
  recommendedActions: string[];
  confidence: number;
  dataSources: string[];
}

const suggestedQuestions = [
  "Where did we lose the most revenue this month?",
  "How much revenue is waiting on carrier approval?",
  "Which supplements are still pending?",
  "Which claims have outstanding balances?",
  "Which claims haven't been updated recently?",
  "Which claims require immediate attention?",
  "Which jobs have stalled?",
  "Which inspections never became claims?",
  "Which supplements are awaiting carrier response?",
  "Which supplements were denied?",
  "Which supplements are most likely to require revision?",
  "Which adjusters approve supplements fastest?",
  "Which adjusters deny the most money?",
  "Which carriers take longest to respond?",
  "Which estimators close the most revenue?",
  "Which inspectors identify the most supplement opportunities?",
  "Which jobs are missing documentation?",
  "Which claims are missing required documents?",
  "Which interviews are incomplete?",
  "Which AI recommendations were accepted?",
  "Which recommendations were rejected?",
  "What recurring supplement opportunities has Atlas identified?",
];
export default function AskAtlas() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await apiFetch("/intelligence/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      setResult(response as QueryResult);
    } catch (err) {
      setError("Failed to process question. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSuggestedQuestion = (q: string) => {
    setQuestion(q);
  };
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <h2 className="text-2xl font-semibold text-foreground">
          Ask Atlas
        </h2>{" "}
        <p className="text-muted-foreground mt-1">
          Ask questions about your business
        </p>{" "}
      </div>{" "}
      {/* Input Form */}{" "}
      <form onSubmit={handleSubmit} className="space-y-4">
        {" "}
        <div className="relative">
          {" "}
          <Input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Atlas anything..."
            disabled={loading}
            className="w-full"
          />{" "}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={loading || !question.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {loading ? "Asking..." : "Ask"}
          </Button>{" "}
        </div>{" "}
      </form>{" "}
      {/* Error */}{" "}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}{" "}
      {/* Suggested Questions */}{" "}
      <div>
        {" "}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Suggested questions
        </h3>{" "}
        <div className="flex flex-wrap gap-2">
          {" "}
          {suggestedQuestions.map((q, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuestion(q)}
              className="h-auto text-xs px-3 py-1.5 whitespace-normal text-left"
            >
              {q}
            </Button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      {/* Result */}{" "}
      {result && (
        <div className="bg-surface rounded-xl border p-6 space-y-6">
          {" "}
          {/* Answer */}{" "}
          <div>
            {" "}
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Answer
            </h3>{" "}
            <p className="text-foreground">{result.answer}</p>{" "}
          </div>{" "}
          {/* Reasoning */}{" "}
          <div>
            {" "}
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Reasoning
            </h3>{" "}
            <p className="text-muted-foreground">
              {result.reasoning}
            </p>{" "}
          </div>{" "}
          {/* Statistics */}{" "}
          {Object.keys(result.statistics).length > 0 && (
            <div>
              {" "}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Statistics
              </h3>{" "}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {" "}
                {Object.entries(result.statistics).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-muted p-3 rounded-lg"
                  >
                    {" "}
                    <p className="text-xs text-muted-foreground">
                      {key}
                    </p>{" "}
                    <p className="text-lg font-semibold text-foreground">
                      {value}
                    </p>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* Supporting Records */}{" "}
          {result.supportingRecords.length > 0 && (
            <div>
              {" "}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Supporting Records
              </h3>{" "}
              <div className="space-y-2">
                {" "}
                {result.supportingRecords.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    {" "}
                    <div>
                      {" "}
                      <p className="font-medium text-foreground">
                        {record.description}
                      </p>{" "}
                      <p className="text-xs text-muted-foreground">
                        {record.id} • {record.type}
                      </p>{" "}
                    </div>{" "}
                    {record.value !== undefined && (
                      <span className="font-semibold text-foreground">
                        {" "}
                        {typeof record.value === "number"
                          ? `$${record.value.toLocaleString()}`
                          : record.value}{" "}
                      </span>
                    )}{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* Recommended Actions */}{" "}
          {result.recommendedActions.length > 0 && (
            <div>
              {" "}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Recommended Actions
              </h3>{" "}
              <ul className="space-y-2">
                {" "}
                {result.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    {" "}
                    <Lightbulb className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span className="text-foreground">
                      {action}
                    </span>
                  </li>
                ))}{" "}
              </ul>{" "}
            </div>
          )}{" "}
          {/* Confidence & Data Sources */}{" "}
          <div className="flex items-center justify-between pt-4 border-t">
            {" "}
            <div className="flex items-center space-x-4">
              {" "}
              <div>
                {" "}
                <p className="text-xs text-muted-foreground">
                  Confidence
                </p>{" "}
                <p className="font-semibold text-foreground">
                  {Math.round(result.confidence * 100)}%
                </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-xs text-muted-foreground">
                  Data Sources
                </p>{" "}
                <p className="font-semibold text-foreground">
                  {result.dataSources.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
