"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button, Input } from "@project-atlas/ui";
import { Menu, Search, Bell, LogOut, User } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
  type: "action" | "warning" | "opportunity";
  relatedEntityType?: "claim" | "supplement" | "interview" | "document";
  relatedEntityId?: string;
  createdAt: string;
}

interface TopNavigationProps {
  onMobileMenuToggle?: () => void;
}

export default function TopNavigation({
  onMobileMenuToggle,
}: TopNavigationProps) {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await apiFetch("/intelligence/recommendations");
        const recs = (response as Notification[]) || [];
        recs.sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          }
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setNotifications(recs);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };
    if (session) {
      loadNotifications();
    }
  }, [session]);

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface border-b border-[var(--border)] flex items-center justify-between px-4 md:px-6 z-40">
      {/* Mobile Menu Button & Logo */}
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative w-28 h-8 md:w-36 md:h-10">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Project Atlas"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search - Hidden on mobile */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input type="text" placeholder="Search..." className="pl-10" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {notifications.length}
              </span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 panel-atlas rounded-lg shadow-xl p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-foreground font-medium">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {notifications.length} new
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No new notifications.
                  </p>
                ) : (
                  notifications.map((notification) => {
                    const href = notification.relatedEntityType
                      ? `/admin/${notification.relatedEntityType}s`
                      : "/admin/activity";
                    const priorityColor =
                      notification.priority === "high"
                        ? "bg-destructive/10 border-destructive/30"
                        : notification.priority === "medium"
                          ? "bg-warning/10 border-warning/30"
                          : "bg-info/10 border-info/30";
                    return (
                      <a
                        key={notification.id}
                        href={href}
                        className={`block p-2 rounded text-sm border hover:bg-muted/50 transition-colors ${priorityColor}`}
                      >
                        <p className="font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.reason}
                        </p>
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowProfile(!showProfile)}
            className="gap-2 hidden md:flex"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
              {session?.user?.email?.[0].toUpperCase() || "U"}
            </div>
            <span className="text-foreground text-sm hidden md:block">
              {session?.user?.email?.split("@")[0] || "User"}
            </span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowProfile(!showProfile)}
            className="md:hidden"
            aria-label="User menu"
          >
            <User className="h-5 w-5" />
          </Button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 panel-atlas rounded-lg shadow-xl p-2">
              <div className="px-3 py-2 border-b border-[var(--border)]">
                <p className="text-foreground text-sm font-medium">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
