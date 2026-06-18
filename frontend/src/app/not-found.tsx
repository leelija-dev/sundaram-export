// src/app/not-found.tsx

import Link from "next/link";
import { Button, Container } from "@/components/site-ui";
import { HomeIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-white via-white to-primary/5">
      {/* Subtle background - no floating elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(14,116,144,0.03),transparent_50%),radial-gradient(circle_at_90%_80%,rgba(217,119,6,0.02),transparent_50%)]" />
      
      {/* Inject keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes subtlePulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
          opacity: 0;
        }
        
        .animate-subtle-pulse {
          animation: subtlePulse 3s ease-in-out infinite;
        }
      `}</style>

      <Container className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        {/* 404 badge - gold outline */}
        <div className="animate-fadeSlideUp" style={{ animationDelay: "0s" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 text-sm font-semibold text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-subtle-pulse" />
            <span>Error 404</span>
          </div>
        </div>
        
        {/* Main heading */}
        <div className="animate-fadeSlideUp" style={{ animationDelay: "0.08s" }}>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl lg:text-8xl">
            Page not found
          </h1>
        </div>
        
        {/* Decorative gold line */}
        <div className="animate-fadeSlideUp" style={{ animationDelay: "0.12s" }}>
          <div className="mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>
        
        {/* Description */}
        <div className="animate-fadeSlideUp" style={{ animationDelay: "0.16s" }}>
          <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>
        
        {/* Quick navigation links */}
        <div className="animate-fadeSlideUp" style={{ animationDelay: "0.2s" }}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted">You could try:</span>
            <Link 
              href="/" 
              className="group font-medium text-secondary transition-all duration-200 hover:text-accent"
            >
              Homepage
              <span className="block h-px w-0 bg-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <span className="text-border">•</span>
            <Link 
              href="/products" 
              className="group font-medium text-secondary transition-all duration-200 hover:text-accent"
            >
              Products
              <span className="block h-px w-0 bg-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <span className="text-border">•</span>
            <Link 
              href="/markets" 
              className="group font-medium text-secondary transition-all duration-200 hover:text-accent"
            >
              Markets
              <span className="block h-px w-0 bg-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <span className="text-border">•</span>
            <Link 
              href="/about" 
              className="group font-medium text-secondary transition-all duration-200 hover:text-accent"
            >
              About
              <span className="block h-px w-0 bg-accent transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="animate-fadeSlideUp mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4" style={{ animationDelay: "0.24s" }}>
          <Button 
            href="/" 
            variant="accent" 
            fullWidthOnMobile 
            className="px-6 py-2.5 text-sm font-semibold shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to home
          </Button>
          <Button
            href="/contact"
            variant="outline"
            fullWidthOnMobile
            className="border-primary/30 text-primary font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            <EnvelopeIcon className="mr-2 h-4 w-4" />
            Contact support
          </Button>
        </div>
        
        {/* Professional support card */}
        <div className="animate-fadeSlideUp mt-12 w-full max-w-md rounded-xl border border-border/50 bg-surface/30 p-5 text-center backdrop-blur-sm" style={{ animationDelay: "0.28s" }}>
          <p className="text-sm font-medium text-foreground">
            Need immediate assistance?
          </p>
          <p className="mt-1 text-xs text-muted">
            Our export desk is available 24/7 to assist with your inquiries.
          </p>
          <Link
            href="/quote"
            className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all duration-200 hover:text-secondary hover:gap-2"
          >
            Request a quote
            <span className="text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}