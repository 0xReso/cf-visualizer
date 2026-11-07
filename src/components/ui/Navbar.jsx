import React from "react";
import { Button } from "@/components/ui/button";
import ShineBorder from "@/components/magic-ui/shine-border";
import { FaGithub } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="container mx-auto px-3 py-2 flex justify-between items-center">
      <h1 className="text-lg font-bold text-white">CF Visualizer</h1>
      <a
        href="https://github.com/0xReso/cf-visualizer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ShineBorder 
          shineColor="#3b82f6" 
          duration={2}
          borderWidth={1}
        >
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-800 border-0 px-3 py-1.5 rounded-full transition-colors text-xs"
          >
            <FaGithub className="mr-1.5 h-3 w-3" />
            Star on GitHub
          </Button>
        </ShineBorder>
      </a>
    </nav>
  );
}