"use client";

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * The official HomeRun Thunder / Lightning bolt icon.
 * Renders ONLY the lightning bolt (no background box),
 * allowing it to be styled with any text color (e.g. text-[#f5c518], text-white, etc.).
 */
export function HomeRunThunder({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="130 85 240 340"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M297 103 L161 280 H241 L206 403 L342 226 H263 Z" />
    </svg>
  );
}

/**
 * The official HomeRun Brand Logo Mark.
 * Renders the authentic rounded yellow square with the black thunderbolt.
 */
export function HomeRunLogo({ className = "w-8 h-8", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="HomeRun Logo"
      {...props}
    >
      <rect x="65" y="65" width="382" height="382" rx="76" fill="#EFC41A" />
      <path d="M297 103 L161 280 H241 L206 403 L342 226 H263 Z" fill="#000000" />
    </svg>
  );
}

export default HomeRunLogo;
