"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { isBlogPath } from "@/app/lib/blog";

export function BlogBackLink({
  children,
  referrer,
}: {
  children: React.ReactNode;
  referrer: string;
}) {
  const router = useRouter();
  if (isBlogPath(referrer)) {
    return (
      <button
        type="button"
        className="lv-link-arrow lv-back"
        onClick={() => router.back()}
      >
        {children}
      </button>
    );
  }
  return (
    <Link
      href={`./`}
      className="lv-link-arrow lv-back"
      // transitionTypes={["nav-back"]}
    >
      {children}
    </Link>
  );
}
