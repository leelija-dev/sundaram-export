// src/components/home-hero.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Container } from "@/components/site-ui";
import { site } from "@/data/site";
import { useEffect, useState } from "react";

type HomeHeroProps = {
  productCount?: number;
  countryCount?: number;
};

export function HomeHero({ productCount = 0, countryCount = 0 }: HomeHeroProps) {
  const liveCountries = countryCount > 0 ? countryCount : null;
  const liveProducts = productCount > 0 ? productCount : null;
  
  // Fix hydration mismatch by using client-side only rendering for animations
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#061630] text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.08),transparent_50%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.05),transparent_50%)]" />

      <Container className="max-w-[1400px] relative z-10 pt-12 pb-16 md:pt-16 lg:pt-20 lg:pb-24 px-4 md:px-6 lg:px-8">
        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* ================= LEFT COLUMN ================= */}
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
              Delivering premium spices, textiles, and engineering goods across 90+ countries worldwide.
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

          {/* ================= RIGHT COLUMN - Professional Map Image ================= */}
          <div className="relative w-full">
            <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-xl overflow-hidden">
              
              {/* World Map Image */}
              <Image
                src="/world-map.png"
                alt="World Map - Global Export Network"
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Fallback SVG if image is missing */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a1a3a] rounded-xl border border-white/10">
                <div className="text-center text-white/50">
                  <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">World map image missing</p>
                  <p className="text-xs mt-1">Add /public/world-map.png</p>
                </div>
              </div>

              {/* Animated overlay dots - India Hub */}
              {isMounted && (
                <>
                  {/* India Glow */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-[42%] -translate-y-[35%]">
                    <div className="relative">
                      <div className="absolute w-20 h-20 rounded-full bg-accent/30 animate-ping" />
                      <div className="absolute w-16 h-16 rounded-full bg-accent/20 animate-pulse" />
                      <div className="relative w-8 h-8 rounded-full bg-accent/80 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Trade Route Lines and Dots - Only on client side */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                        <stop offset="30%" stopColor="#f59e0b" stopOpacity="1" />
                        <stop offset="70%" stopColor="#f59e0b" stopOpacity="1" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* USA */}
                    <line x1="52%" y1="42%" x2="35%" y2="35%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 120" className="animate-dash" />
                    <circle r="4" fill="#f59e0b" className="animate-dot" style={{ transform: "translate(35%, 35%)" }} />
                    
                    {/* UK/Europe */}
                    <line x1="52%" y1="42%" x2="58%" y2="32%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 120" className="animate-dash delay-1" />
                    <circle r="4" fill="#f59e0b" className="animate-dot delay-1" style={{ transform: "translate(58%, 32%)" }} />
                    
                    {/* Australia */}
                    <line x1="52%" y1="42%" x2="80%" y2="65%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 120" className="animate-dash delay-2" />
                    <circle r="4" fill="#f59e0b" className="animate-dot delay-2" style={{ transform: "translate(80%, 65%)" }} />
                    
                    {/* UAE (import - green) */}
                    <line x1="62%" y1="38%" x2="52%" y2="42%" stroke="#10b981" strokeWidth="2" strokeDasharray="6 120" className="animate-dash-import" />
                    <circle r="4" fill="#10b981" className="animate-dot-import" style={{ transform: "translate(52%, 42%)" }} />
                    
                    {/* Singapore */}
                    <line x1="68%" y1="55%" x2="52%" y2="42%" stroke="#10b981" strokeWidth="2" strokeDasharray="6 120" className="animate-dash-import delay-1" />
                    <circle r="4" fill="#10b981" className="animate-dot-import delay-1" style={{ transform: "translate(52%, 42%)" }} />
                  </svg>
                </>
              )}

              {/* India Hub Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:left-[48%] lg:-translate-y-1/4 z-20">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-accent/30 blur-xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-[#0a1a3a] via-[#061630] to-[#020d22] border-2 border-accent/80 rounded-xl px-5 py-2.5 text-center shadow-2xl backdrop-blur-sm">
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                    <p className="text-base font-bold uppercase tracking-wide text-white">INDIA</p>
                    <p className="text-xs font-semibold text-accent">Global Export Hub</p>
                    <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-accent animate-ping" />
                    <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-md">
              <div className="border-r border-white/15 last:border-r-0">
                <p className="text-xl sm:text-2xl font-black text-white transition-colors hover:text-accent">
                  {liveCountries ?? "90+"}
                </p>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60">Global Markets</p>
              </div>
              <div className="border-r border-white/15 last:border-r-0">
                <p className="text-xl sm:text-2xl font-black text-white transition-colors hover:text-accent">
                  {liveProducts ?? "6"}
                </p>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60">Categories</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white transition-colors hover:text-accent">24/7</p>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60">Trade Support</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Global CSS animations */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -240; }
        }
        @keyframes dashImport {
          to { stroke-dashoffset: -240; }
        }
        @keyframes dot {
          0% { opacity: 1; r: 4; }
          50% { opacity: 1; r: 6; }
          100% { opacity: 0; r: 4; }
        }
        
        .animate-dash {
          stroke-dasharray: 8 240;
          animation: dash 3s linear infinite;
        }
        .animate-dash-import {
          stroke-dasharray: 8 240;
          animation: dashImport 3.5s linear infinite;
        }
        .animate-dot {
          animation: dot 3s linear infinite;
        }
        .animate-dot-import {
          animation: dot 3.5s linear infinite;
        }
        .delay-1 { animation-delay: 1s; }
        .delay-2 { animation-delay: 2s; }
      `}</style>
    </section>
  );
}