"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { apiFetch } from "@/lib/api";
import AskAtlas from "@/components/intelligence/AskAtlas";

export default function HomePage() {
  const { session, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    const checkDemoStatus = async () => {
      try {
        const response = await apiFetch("/demo/status");
        const status = response as { enabled: boolean };
        if (status.enabled) {
          router.push("/admin/demo");
        }
      } catch (error) {
        // Demo endpoint might not be available, ignore error
      }
    };
    checkDemoStatus();
  }, [session, router]);

  if (loading || !session) return null;

  return <AskAtlas />;
}
