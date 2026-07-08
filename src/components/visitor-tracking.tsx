"use client";

import Link from "next/link";
import { track } from "@vercel/analytics/react";
import { type ReactNode, useEffect } from "react";

function getReferrerHost() {
  if (!document.referrer) return "direct";
  try {
    return new URL(document.referrer).hostname || "unknown";
  } catch {
    return "unknown";
  }
}

function getUtmParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
  };
}

export function VisitorTracking() {
  useEffect(() => {
    const path = window.location.pathname;
    const key = `crpulse:visit:${path}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    track("visitor_page_view", {
      path,
      referrer_host: getReferrerHost(),
      ...getUtmParams(window.location.search),
    });
  }, []);

  return null;
}

export function ProfileViewTracker({ playerName, slug, teamName }: { playerName: string; slug: string; teamName: string }) {
  useEffect(() => {
    const key = `crpulse:profile:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    track("profile_view", {
      player: playerName,
      slug,
      team: teamName,
      referrer_host: getReferrerHost(),
      ...getUtmParams(window.location.search),
    });
  }, [playerName, slug, teamName]);

  return null;
}

export function ProfileLink({
  href,
  playerName,
  source,
  className,
  children,
}: {
  href: string;
  playerName: string;
  source: string;
  className?: string;
  children: ReactNode;
}) {
  const slug = href.split("/").filter(Boolean).pop() ?? playerName.toLowerCase().replaceAll(" ", "-");

  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        track("profile_link_click", {
          player: playerName,
          slug,
          source,
          path: window.location.pathname,
        })
      }
    >
      {children}
    </Link>
  );
}
