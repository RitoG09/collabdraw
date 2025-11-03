"use client";

import React, { useState } from "react";

import { Dancing_Script } from "next/font/google";

import { LogOut, Settings, User } from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import ProtectedRoute from "../../components/own/protectedRoute";
import { Button } from "../../components/ui/button";
import ExpandableCardDemoGrid from "../../components/expandable-card-demo-grid";

const dancingScript = Dancing_Script({
  weight: "700",
  subsets: ["latin"],
});

export default function DrawSpace() {
  const user = useUserStore((s) => s.user);
  const [joinRoom, setJoinRoom] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    console.log("Profile clicked");
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    setIsDropdownOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-gray-800">
        <header className="w-full px-6 py-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center">
              <text fontSize="100" fontWeight="600" fill="currentColor">
                Collab{" "}
                <tspan
                  className={`${dancingScript.className} text-red-800 font-extrabold`}
                  fontSize="25"
                >
                  Draw
                </tspan>
              </text>
            </div>
            <div className="relative">
              <Button
                variant={"ghost"}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.username}</span>
                <div
                  className={`w-2 h-2 border-r-2 border-b-2 border-white transition-transform duration-200 ${isDropdownOpen ? "rotate-45" : "rotate-[225deg]"}`}
                />
              </Button>
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 left-1 mt-4 w-40 bg-gray-700 backdrop-blur-sm border-2 border-yellow-800 rounded-lg shadow-xl z-20">
                    <div className="py-2">
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                      <hr className="border-white/10 mx-2" />
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-2xl sm:text-3xl text-white mb-4">
              Select Mode
            </div>
            <p className="text-xl text-gray-300">
              Choose how you want to create your masterpiece
            </p>
          </div>
          <div className="w-full max-w-3xl">
            <div className="border-4 bg-gray-700 border-yellow-800 p-3 rounded-2xl">
              <ExpandableCardDemoGrid />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
