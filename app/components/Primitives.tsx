"use client";
import "./Primitives.css";
import React from "react";
import Image from "next/image";

export const TECH_LOGOS: Record<string, string> = {
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/ffffff",
  ".NET":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  Android:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
  PostgreSQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  React:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "SQL Server":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
  Azure:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  Oracle:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "Node.js":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  MySQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  Docker:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  Tailwind:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
};

export function Kicker({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  return <Tag className={`lv-kicker ${className}`}>{children}</Tag>;
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="lv-pill">{children}</span>;
}

export function TechChip({ children }: { children: string }) {
  const logo = TECH_LOGOS[children];
  return (
    <span className={`lv-chip ${logo ? "has-logo" : ""}`}>
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="lv-chip-logo"
          src={logo}
          alt=""
          width={14}
          height={14}
        />
      )}
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  onClick,
  icon: Icon,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "link";
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  return (
    <button className={`lv-btn lv-btn-${variant}`} onClick={onClick}>
      {children}
      {Icon && <Icon size={16} />}
    </button>
  );
}
