// src/components/home-hero.tsx

"use client";

import Link from "next/link";
import { Button, Container } from "@/components/site-ui";
import { site } from "@/data/site";

type HomeHeroProps = {
  productCount?: number;
  countryCount?: number;
};

export function HomeHero({ productCount = 0, countryCount = 0 }: HomeHeroProps) {
  const liveCountries = countryCount > 0 ? countryCount : null;
  const liveProducts = productCount > 0 ? productCount : null;

  return (
    <section className="relative overflow-hidden bg-[#061630] text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.08),transparent_50%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.05),transparent_50%)]" />

      <Container className="max-w-[1400px] relative z-10 pt-12 pb-16 md:pt-16 lg:pt-20 lg:pb-24">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12 xl:gap-16">
          
          {/* LEFT COLUMN - Content */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
              <span>Global export house</span>
              <span className="text-white/30">•</span>
              <span className="text-white/70">Est. {site.founded}</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Connecting Indian Excellence
              <span className="mt-2 block text-accent">to Global Markets</span>
            </h1>

            <p className="max-w-lg text-base text-white/70 md:text-lg">
              Delivering premium spices, textiles, and engineering goods across the globe.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button href="/quote" variant="accent" fullWidthOnMobile className="px-6 py-3 text-base font-bold shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5">
                Request export quote
              </Button>
              <Button href="/products" variant="outline" fullWidthOnMobile className="border-white/30 bg-white/5 text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/10">
                Explore product catalog
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-white/20 hover:scale-105">
                ✓ ISO Certified
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-white/20 hover:scale-105">
                ✓ Global Logistics
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-white/20 hover:scale-105">
                ✓ Export Compliance
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN - 3D Continents Map */}
          <div className="space-y-4">
            <div className="relative w-full" style={{ height: "600px" }}>
              {/* Water surface reflection */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061630] via-transparent to-transparent pointer-events-none" />
              
              <svg viewBox="0 0 1400 900" className="absolute inset-0 h-full w-full drop-shadow-2xl">
                <defs>
                  {/* Gradients for 3D continents */}
                  <linearGradient id="na-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4a90d9" />
                    <stop offset="100%" stopColor="#2c5a8c" />
                  </linearGradient>
                  <linearGradient id="sa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82c4" />
                    <stop offset="100%" stopColor="#1e4a76" />
                  </linearGradient>
                  <linearGradient id="af-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5a9ae0" />
                    <stop offset="100%" stopColor="#2a5a8a" />
                  </linearGradient>
                  <linearGradient id="eu-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5588d4" />
                    <stop offset="100%" stopColor="#254a70" />
                  </linearGradient>
                  <linearGradient id="as-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#609f6f" />
                    <stop offset="100%" stopColor="#2e5a3a" />
                  </linearGradient>
                  <linearGradient id="au-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7a5a3a" />
                    <stop offset="100%" stopColor="#4a2a1a" />
                  </linearGradient>
                  <linearGradient id="in-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  {/* Export line gradient */}
                  <linearGradient id="export-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                    <stop offset="20%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="80%" stopColor="#f59e0b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>

                  {/* Import line gradient */}
                  <linearGradient id="import-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                    <stop offset="20%" stopColor="#10b981" stopOpacity="1" />
                    <stop offset="80%" stopColor="#10b981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>

                  {/* Shadow filter for 3D depth */}
                  <filter id="continent-shadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="3" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.5)" />
                  </filter>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ocean background */}
                <rect width="100%" height="100%" fill="#0a1a3a" />

                {/* Water ripple effect */}
                <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.8">
                  {[...Array(20)].map((_, i) => (
                    <ellipse key={i} cx="700" cy="450" rx={200 + i * 40} ry={100 + i * 20} fill="none" stroke="rgba(255,255,255,0.02)" />
                  ))}
                </g>

                {/* ===== CONTINENTS AS 3D BUTTONS (each rises from water) ===== */}
                
                {/* North America - rises with delay 0s */}
                <g filter="url(#continent-shadow)" className="animate-continent-rise" style={{ animationDelay: "0s" }}>
                  <path d="M260,200 L330,170 L400,175 L450,200 L480,250 L490,310 L460,350 L410,370 L360,360 L320,380 L290,420 L260,410 L220,370 L190,320 L180,260 L190,220 Z" fill="url(#na-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M260,200 L330,170 L400,175 L450,200 L480,250 L490,310 L460,350 L410,370 L360,360 L320,380 L290,420 L260,410 L220,370 L190,320 L180,260 L190,220 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" transform="scale(0.98) translate(5,5)" />
                </g>

                {/* South America - rises with delay 0.2s */}
                <g filter="url(#continent-shadow)" className="animate-continent-rise" style={{ animationDelay: "0.2s" }}>
                  <path d="M420,430 L480,410 L530,440 L540,510 L520,570 L470,600 L430,590 L410,560 L400,500 Z" fill="url(#sa-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                </g>

                {/* Europe - rises with delay 0.4s */}
                <g filter="url(#continent-shadow)" className="animate-continent-rise" style={{ animationDelay: "0.4s" }}>
                  <path d="M680,160 L720,150 L770,165 L790,195 L780,230 L750,240 L700,230 L660,210 Z" fill="url(#eu-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                </g>

                {/* Africa - rises with delay 0.6s */}
                <g filter="url(#continent-shadow)" className="animate-continent-rise" style={{ animationDelay: "0.6s" }}>
                  <path d="M650,280 L710,265 L760,285 L790,330 L800,390 L770,440 L720,460 L670,440 L640,390 L630,330 Z" fill="url(#af-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                </g>

                {/* Asia - rises with delay 0.8s */}
                <g filter="url(#continent-shadow)" className="animate-continent-rise" style={{ animationDelay: "0.8s" }}>
                  <path d="M790,160 L860,130 L930,140 L1000,170 L1040,220 L1030,280 L980,310 L910,320 L860,300 L830,280 L800,250 L790,210 Z" fill="url(#as-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M980,350 L1030,330 L1080,360 L1070,410 L1020,420 L980,400 Z" fill="url(#as-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                </g>

                {/* Australia - rises with delay 1.0s */}
                <g filter="url(#continent-shadow)" className="animate-continent-rise" style={{ animationDelay: "1.0s" }}>
                  <path d="M1020,540 L1090,520 L1160,540 L1180,600 L1130,640 L1060,630 L1020,590 Z" fill="url(#au-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                </g>

                {/* India - rises with delay 1.2s (highlighted, different color) */}
                <g filter="url(#continent-shadow)" className="animate-continent-rise" style={{ animationDelay: "1.2s" }}>
                  <path d="M860,300 L900,310 L920,360 L900,400 L860,390 L840,350 L840,310 Z" fill="url(#in-grad)" stroke="#f59e0b" strokeWidth="2.5" />
                  <path d="M860,300 L900,310 L920,360 L900,400 L860,390 L840,350 L840,310 Z" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1" transform="scale(0.95) translate(20,15)" />
                </g>

                {/* City nodes */}
                <g className="animate-fade-in" style={{ animationDelay: "1.4s" }}>
                  <circle cx="330" cy="240" r="7" fill="#f59e0b" />
                  <circle cx="750" cy="185" r="7" fill="#f59e0b" />
                  <circle cx="1020" cy="250" r="7" fill="#f59e0b" />
                  <circle cx="550" cy="420" r="7" fill="#f59e0b" />
                  <circle cx="950" cy="580" r="7" fill="#f59e0b" />
                  <circle cx="880" cy="345" r="10" fill="#ef4444" stroke="#f59e0b" strokeWidth="2" />
                </g>

                {/* Animated export routes (Gold) */}
                <g fill="none" strokeLinecap="round" className="animate-fade-in" style={{ animationDelay: "1.6s" }}>
                  <path className="animate-export-line" stroke="url(#export-grad)" strokeWidth="3.5" filter="url(#glow)" d="M880,345 Q700,280 480,270 Q380,260 330,240" />
                  <path className="animate-export-line delay-1" stroke="url(#export-grad)" strokeWidth="3.5" filter="url(#glow)" d="M880,345 Q820,230 750,185" />
                  <path className="animate-export-line delay-2" stroke="url(#export-grad)" strokeWidth="3.5" filter="url(#glow)" d="M880,345 Q950,290 1020,250" />
                  <path className="animate-export-line delay-3" stroke="url(#export-grad)" strokeWidth="3.5" filter="url(#glow)" d="M880,345 Q920,460 950,580" />
                </g>

                {/* Animated import routes (Green) */}
                <g fill="none" strokeLinecap="round" className="animate-fade-in" style={{ animationDelay: "1.8s" }}>
                  <path className="animate-import-line" stroke="url(#import-grad)" strokeWidth="3" filter="url(#glow)" d="M330,240 Q480,300 700,340 Q800,360 880,345" />
                  <path className="animate-import-line delay-1" stroke="url(#import-grad)" strokeWidth="3" filter="url(#glow)" d="M750,185 Q800,260 880,345" />
                  <path className="animate-import-line delay-2" stroke="url(#import-grad)" strokeWidth="3" filter="url(#glow)" d="M550,420 Q680,400 880,345" />
                </g>

                {/* Moving dots */}
                <circle r="5" fill="#f59e0b" className="animate-moving-dot" style={{ offsetPath: "path('M880,345 Q700,280 480,270 Q380,260 330,240')" }} />
                <circle r="5" fill="#f59e0b" className="animate-moving-dot delay-1" style={{ offsetPath: "path('M880,345 Q820,230 750,185')" }} />
                <circle r="5" fill="#f59e0b" className="animate-moving-dot delay-2" style={{ offsetPath: "path('M880,345 Q950,290 1020,250')" }} />
                <circle r="5" fill="#f59e0b" className="animate-moving-dot delay-3" style={{ offsetPath: "path('M880,345 Q920,460 950,580')" }} />
                <circle r="5" fill="#10b981" className="animate-moving-dot-import" style={{ offsetPath: "path('M330,240 Q480,300 700,340 Q800,360 880,345')" }} />
                <circle r="5" fill="#10b981" className="animate-moving-dot-import delay-1" style={{ offsetPath: "path('M750,185 Q800,260 880,345')" }} />
              </svg>

              {/* India Hub Marker */}
              <div className="absolute left-[62.8%] top-[38.3%] -translate-x-1/2 -translate-y-1/2 animate-fade-in" style={{ animationDelay: "2s" }}>
                <div className="absolute h-20 w-20 rounded-full bg-accent/30 blur-xl animate-pulse" />
                <div className="relative rounded-xl border-2 border-accent bg-[#061630]/95 px-5 py-2.5 text-center shadow-2xl backdrop-blur-md transform transition-transform hover:scale-105">
                  <p className="text-base font-bold uppercase tracking-wide text-white drop-shadow-lg">INDIA</p>
                  <p className="text-xs font-semibold text-accent">Global Export Hub</p>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 rounded-md bg-black/60 px-3 py-2 text-sm font-bold text-accent backdrop-blur-sm shadow-lg flex items-center gap-2 animate-fade-in" style={{ animationDelay: "2.2s" }}>
                <div className="h-1.5 w-10 rounded-full bg-gradient-to-r from-accent to-transparent" />
                <span>Outbound Exports</span>
              </div>
              <div className="absolute bottom-4 left-[200px] rounded-md bg-black/60 px-3 py-2 text-sm font-bold text-emerald-400 backdrop-blur-sm shadow-lg flex items-center gap-2 animate-fade-in" style={{ animationDelay: "2.4s" }}>
                <div className="h-1.5 w-10 rounded-full bg-gradient-to-r from-emerald-400 to-transparent" />
                <span>Inbound Imports</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-md">
              <div className="border-r border-white/15 last:border-r-0">
                <p className="text-xl font-black text-white transition-colors hover:text-accent sm:text-2xl">
                  {liveCountries ?? "90+"}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60 sm:text-[10px]">Global Markets</p>
              </div>
              <div className="border-r border-white/15 last:border-r-0">
                <p className="text-xl font-black text-white transition-colors hover:text-accent sm:text-2xl">
                  {liveProducts ?? "6"}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60 sm:text-[10px]">Categories</p>
              </div>
              <div>
                <p className="text-xl font-black text-white transition-colors hover:text-accent sm:text-2xl">24/7</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60 sm:text-[10px]">Trade Support</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes continentRise {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.85);
            filter: blur(8px);
          }
          40% {
            opacity: 0.5;
            transform: translateY(20px) scale(0.95);
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes dashExport {
          to {
            stroke-dashoffset: -250;
          }
        }
        
        @keyframes dashImport {
          to {
            stroke-dashoffset: -220;
          }
        }
        
        @keyframes moveDot {
          0% {
            offset-distance: 0%;
            opacity: 1;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
            transform: scale(0.8);
          }
        }
        
        .animate-continent-rise {
          animation: continentRise 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.2) forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-export-line {
          stroke-dasharray: 12, 180;
          stroke-dashoffset: 250;
          animation: dashExport 3.5s linear infinite;
        }
        
        .animate-import-line {
          stroke-dasharray: 10, 150;
          stroke-dashoffset: 220;
          animation: dashImport 4s linear infinite;
        }
        
        .animate-moving-dot {
          offset-rotate: auto;
          animation: moveDot 3.5s linear infinite;
        }
        
        .animate-moving-dot-import {
          offset-rotate: auto;
          animation: moveDot 4s linear infinite;
        }
        
        .delay-1 {
          animation-delay: 1.2s;
        }
        
        .delay-2 {
          animation-delay: 2.4s;
        }
        
        .delay-3 {
          animation-delay: 3.6s;
        }
      `}</style>
    </section>
  );
}