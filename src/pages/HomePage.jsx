import React, { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SingleProfile from "./SingleProfile";
import CompareProfiles from "./CompareProfiles";
import { DotPattern } from "@/components/magic-ui/dot-pattern";
import { SparklesCore } from "@/components/magic-ui/sparkles";
import { CursorGlow } from "@/components/magic-ui/cursor-glow";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("single");
  const [handle, setHandle] = useState("");
  const [handle1, setHandle1] = useState("");
  const [handle2, setHandle2] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === "single" && handle) {
      setSubmittedSearch({ type: "single", handle });
    } else if (activeTab === "compare" && handle1 && handle2) {
      setSubmittedSearch({ type: "compare", handle1, handle2 });
    }
  };

  return (
    <div className="relative bg-black flex flex-col min-h-screen font-sans overflow-x-hidden">
      <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <CursorGlow />
      
      {/* Soft white corner spotlights */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="relative z-20 w-full max-w-3xl flex flex-col items-center">
          <header className="text-center mb-8">
            <div className="relative">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-3 leading-none relative z-10">
                CF Visualizer
              </h1>
              <div className="absolute inset-0 w-full h-full">
                <SparklesCore
                  id="tsparticles"
                  background="transparent"
                  minSize={0.4}
                  maxSize={1.0}
                  particleDensity={80}
                  className="w-full h-full"
                  particleColor="#ffffff"
                />
              </div>
            </div>
            <p className="text-white mt-2 text-sm md:text-base max-w-2xl mx-auto font-light">
              Analyse and visualize your Codeforces performance. Compare profiles,
              track progress, and see your stats in a new light.
            </p>
          </header>

          <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
            <div className="flex justify-center mb-4 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("single")}
                className={cn(
                  "px-5 py-2 text-xs font-semibold transition-all duration-300 rounded-xl border-2",
                  activeTab === "single"
                    ? "bg-white text-black border-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-transparent text-white border-white/30 hover:border-white/60 hover:bg-white/10"
                )}
              >
                Single Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("compare")}
                className={cn(
                  "px-5 py-2 text-xs font-semibold transition-all duration-300 rounded-xl border-2",
                  activeTab === "compare"
                    ? "bg-white text-black border-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-transparent text-white border-white/30 hover:border-white/60 hover:bg-white/10"
                )}
              >
                Compare Profiles
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2">
              {activeTab === "single" ? (
                <Input
                  type="text"
                  placeholder="Enter Codeforces handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="bg-dim-gray text-white border-neutral-700 h-9 text-sm w-full rounded-full px-4"
                />
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Enter first handle"
                    value={handle1}
                    onChange={(e) => setHandle1(e.target.value)}
                    className="bg-dim-gray text-white border-neutral-700 h-9 text-sm w-full rounded-full px-4"
                  />
                  <Input
                    type="text"
                    placeholder="Enter second handle"
                    value={handle2}
                    onChange={(e) => setHandle2(e.target.value)}
                    className="bg-dim-gray text-white border-neutral-700 h-9 text-sm w-full rounded-full px-4"
                  />
                </>
              )}
              <Button
                type="submit"
                className="w-full md:w-auto min-h-[36px] rounded-full font-semibold bg-white text-black hover:bg-gray-200 transition-colors text-sm px-6"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </main>

      <div className="relative z-20 container mx-auto px-4 w-full">
        {submittedSearch && (
          <div className="mt-8 pb-16">
            {submittedSearch.type === "single" && (
              <SingleProfile submittedHandle={submittedSearch.handle} />
            )}
            {submittedSearch.type === "compare" && (
              <CompareProfiles
                submittedHandles={{
                  handle1: submittedSearch.handle1,
                  handle2: submittedSearch.handle2,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
} 