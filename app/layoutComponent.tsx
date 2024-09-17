"use client"

import { useRouter } from "next/navigation";
import React from "react";

export default function LayoutComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Navigation functions
  const navigateToSwordPage = () => {
    router.push('/');
  };

  const navigateToTreasurePage = () => {
    router.push('/treasure');
  };

  const navigateToHelmetPage = () => {
    router.push('/user');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main>{children}</main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around p-4 bg-gray-800">
        <button onClick={navigateToSwordPage}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
            <rect x="29" y="8" width="6" height="36" fill="#C0C0C0" /> 
            <polygon points="32,40 25,46 39,46" fill="#A9A9A9" />
            <polygon points="32,2 29,8 35,8" fill="#A9A9A9" />
            <rect x="29" y="46" width="6" height="14" fill="#8B4513" /> 
            <circle cx="32" cy="58" r="4" fill="#DAA520" /> 
          </svg>
        </button>
        <button onClick={navigateToTreasurePage}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
            <rect x="4" y="20" width="56" height="28" fill="#A0522D" />
            <rect x="4" y="36" width="56" height="12" fill="#8B4513" />
            <path d="M4 20C4 12 60 12 60 20V24H4V20Z" fill="#D2691E" />
            <rect x="28" y="34" width="8" height="10" fill="#FFD700" />
            <circle cx="32" cy="39" r="2" fill="#B8860B" />
          </svg>
        </button>
        <button onClick={navigateToHelmetPage}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
            <path d="M32 4C18 4 6 16 6 30V50H58V30C58 16 46 4 32 4Z" fill="#708090" />
            <path d="M32 8C44 8 54 18 54 30H10C10 18 20 8 32 8Z" fill="#A9A9A9" />
            <rect x="28" y="34" width="8" height="17" fill="#2F4F4F" />
            <rect x="16" y="34" width="32" height="4" fill="#696969" />
          </svg>
        </button>
      </div>
    </div>
  );
}
