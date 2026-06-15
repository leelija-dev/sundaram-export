"use client";

/** Hero background — world map + routes in one SVG for aligned hub-focused positioning. */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  MAP_CONTAINER_INSET,
  MAP_LAYOUT,
  MAP_VIEW_H,
  MAP_VIEW_W,
  MAP_ZOOM,
  buildHubMask,
  computeHubFocusedViewBox,
  formatViewBox,
  getMapBreakpoint,
  hubPositionInViewBox,
  resolveMapFocus,
  projectLonLat,
  type MapBreakpoint,
} from "@/lib/map-layout";
import { cn } from "@/lib/utils";

const HUB = { ...projectLonLat(88.36, 22.57), label: "Kolkata" };

const ROUTES = [
  { ...projectLonLat(90.41, 23.81), label: "Bangladesh", emphasis: 1 },
  { ...projectLonLat(73.04, 33.68), label: "Pakistan", emphasis: 0.95 },
  { ...projectLonLat(79.86, 6.93), label: "Sri Lanka", emphasis: 0.95 },
  { ...projectLonLat(69.17, 34.53), label: "Afghanistan", emphasis: 0.9 },
  { ...projectLonLat(103.82, 1.35), label: "Singapore", emphasis: 0.85 },
  { ...projectLonLat(55.27, 25.2), label: "UAE", emphasis: 0.8 },
  { ...projectLonLat(-0.13, 51.51), label: "UK", emphasis: 0.35 },
  { ...projectLonLat(-77.04, 38.91), label: "USA", emphasis: 0.3 },
];

const ROUTE_GLOW = "#ffffff";
const ROUTE_LINE = "#ffffff";
const ROUTE_LINE_HOVER = "#ffffff";
const ROUTE_POINT = "#f59e0b";

const MAP_SRC: Record<MapBreakpoint, string> = {
  mobile: "/maps/world-map-compact.svg",
  tablet: "/maps/world-map.svg",
  lg: "/maps/world-map.svg",
  desktop: "/maps/world-map.svg",
};

function arcPath(x1: number, y1: number, x2: number, y2: number, lift: number) {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - lift - Math.abs(x2 - x1) * 0.06;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

function usePinScreenPosition(
  containerRef: RefObject<HTMLDivElement | null>,
  pinX: number | null,
  pinY: number | null,
  viewBox: { x: number; y: number; w: number; h: number }
) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    if (pinX == null || pinY == null) {
      setPosition((prev) => (prev === null ? prev : null));
      return;
    }

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const rx = (pinX - viewBox.x) / viewBox.w;
      const ry = (pinY - viewBox.y) / viewBox.h;
      const next = {
        x: rect.left + rx * rect.width,
        y: rect.top + ry * rect.height,
      };
      setPosition((prev) =>
        prev && prev.x === next.x && prev.y === next.y ? prev : next
      );
    };

    update();
    const el = containerRef.current;
    const observer = el ? new ResizeObserver(update) : null;
    if (el && observer) observer.observe(el);
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [containerRef, pinX, pinY, viewBox.x, viewBox.y, viewBox.w, viewBox.h]);

  return position;
}

function RoutePointTooltip({ x, y, label }: { x: number; y: number; label: string }) {
  return createPortal(
    <div
      className="pointer-events-none fixed z-[200]"
      style={{ left: x, top: y - 10, transform: "translate(-50%, -100%)" }}
      role="tooltip"
    >
      <span className="inline-block whitespace-nowrap rounded-full border border-[#f59e0b] bg-[#0a2540]/97 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white shadow-xl shadow-black/40 sm:text-sm">
        {label}
      </span>
    </div>,
    document.body
  );
}

type ExportNetworkVisualProps = {
  className?: string;
};

export function ExportNetworkVisual({ className = "" }: ExportNetworkVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<MapBreakpoint>("lg");
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: MAP_VIEW_W, h: MAP_VIEW_H });

  const layout = MAP_LAYOUT[breakpoint];
  const hubMask = useMemo(() => {
    const hubPos = hubPositionInViewBox(HUB.x, HUB.y, viewBox);
    return buildHubMask(layout.maskWidth, layout.maskHeight, hubPos.x, hubPos.y);
  }, [layout.maskHeight, layout.maskWidth, viewBox]);

  const updateLayout = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const bp = getMapBreakpoint(window.innerWidth);
    setBreakpoint(bp);

    const rect = el.getBoundingClientRect();
    const focus = resolveMapFocus(bp, rect.left, rect.width, window.innerWidth);
    setViewBox(
      computeHubFocusedViewBox(
        rect.width,
        rect.height,
        MAP_VIEW_W,
        MAP_VIEW_H,
        MAP_ZOOM[bp],
        HUB.x,
        HUB.y,
        focus.dx,
        focus.dy,
        focus.ax,
        focus.ay
      )
    );
  }, []);

  useEffect(() => {
    updateLayout();
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(updateLayout);
    observer.observe(el);
    window.addEventListener("resize", updateLayout, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [updateLayout]);

  const viewBoxStr = formatViewBox(viewBox);
  const mapOpacity = layout.mapOpacity;
  const mapSrc = MAP_SRC[breakpoint];
  const activeRoute = ROUTES.find((r) => r.label === hoveredRoute) ?? null;
  const pinScreenPos = usePinScreenPosition(
    containerRef,
    activeRoute?.x ?? null,
    activeRoute?.y ?? null,
    viewBox
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute",
        MAP_CONTAINER_INSET[breakpoint],
        breakpoint === "desktop" && "xl:inset-0",
        className
      )}
      role="img"
      aria-label="World map showing export network from Kolkata to Bangladesh, Pakistan, Sri Lanka, Afghanistan, Singapore, UAE, UK, and USA"
    >
      {/* Left fade — mobile/tablet only; clipped lg+ panel doesn't need it */}
      {breakpoint === "mobile" || breakpoint === "tablet" ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-[1] bg-gradient-to-r from-[#0a2540] via-[#0a2540]/88 to-transparent",
            breakpoint === "mobile" ? "w-[72%]" : "w-[58%]"
          )}
          aria-hidden
        />
      ) : null}

      {/* Soft panel edges at lg — blend map into hero like reference */}
      {breakpoint === "lg" ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[#0a2540]/70 to-transparent sm:w-14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-14 bg-gradient-to-l from-[#0a2540]/50 to-transparent sm:w-20"
            aria-hidden
          />
        </>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${layout.maskWidth}% ${layout.maskHeight}% at ${hubMask.hubMaskX} ${hubMask.hubMaskY}, rgba(245,158,11,0.16) 0%, rgba(37,99,235,0.08) 40%, transparent 75%)`,
        }}
      />

      <svg
        viewBox={viewBoxStr}
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{
          WebkitMaskImage: hubMask.mask,
          maskImage: hubMask.mask,
        }}
      >
        <image
          href={mapSrc}
          x={0}
          y={0}
          width={MAP_VIEW_W}
          height={MAP_VIEW_H}
          opacity={mapOpacity}
          preserveAspectRatio="none"
          aria-hidden
        />

        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g pointerEvents="none">
          <circle cx={HUB.x} cy={HUB.y} r={layout.hubGlow} fill="url(#hubGlow)" />
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={layout.hubRadius + 1.5}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <circle cx={HUB.x} cy={HUB.y} r={layout.hubRadius} fill="#ffffff" />
          <circle cx={HUB.x} cy={HUB.y} r={layout.hubRadius * 0.38} fill="#0a2540" opacity="0.85" />
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={layout.hubRing}
            stroke="#ffffff"
            strokeWidth="1.25"
            strokeOpacity="0.7"
            fill="none"
          />
        </g>

        {ROUTES.map((point, index) => {
          const isHovered = hoveredRoute === point.label;
          const isNearHub = point.emphasis >= 0.8;
          const strokeWidth = 0.45 + point.emphasis * 0.18;
          const lineOpacity = isHovered ? 1 : 0.28 + point.emphasis * 0.72;
          const glowOpacity = lineOpacity * (isNearHub ? 0.45 : 0.28);
          const pathD = arcPath(HUB.x, HUB.y, point.x, point.y, layout.arcLift);
          const pinR = isHovered ? layout.pinRadius * 1.3 : layout.pinRadius;
          const pinOpacity = isHovered ? 1 : 0.25 + point.emphasis * 0.75;
          const dotPattern = isHovered ? "1.5 5" : "1 6";
          const blinkDelay = `${index * 0.28}s`;

          return (
            <g key={point.label} pointerEvents="none">
              <path
                d={pathD}
                stroke={ROUTE_GLOW}
                strokeOpacity={glowOpacity}
                strokeWidth={strokeWidth + 0.9}
                strokeDasharray={dotPattern}
                strokeLinecap="round"
              />
              <path
                d={pathD}
                stroke={isHovered ? ROUTE_LINE_HOVER : ROUTE_LINE}
                strokeOpacity={lineOpacity}
                strokeWidth={strokeWidth + (isHovered ? 0.15 : 0)}
                strokeDasharray={dotPattern}
                strokeLinecap="round"
              />

              <g
                opacity={pinOpacity}
                transform={`translate(${point.x} ${point.y})`}
              >
                <circle
                  className={isHovered ? undefined : "route-point-blink"}
                  cx={0}
                  cy={0}
                  r={pinR + 1}
                  fill={ROUTE_POINT}
                  style={isHovered ? undefined : { animationDelay: blinkDelay }}
                />
                <circle cx={0} cy={0} r={pinR} fill={ROUTE_POINT} />
                <circle cx={0} cy={0} r={pinR * 0.32} fill="#0a2540" opacity="0.85" />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Hit layer — pin only; route lines are not hover targets */}
      <svg
        viewBox={viewBoxStr}
        className="pointer-events-auto absolute inset-0 z-[3] h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {ROUTES.map((point) => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r={layout.pinRadius + 1.25}
            fill="transparent"
            className="cursor-pointer touch-manipulation"
            onMouseEnter={() => setHoveredRoute(point.label)}
            onMouseLeave={() => setHoveredRoute(null)}
            onFocus={() => setHoveredRoute(point.label)}
            onBlur={() => setHoveredRoute(null)}
            onClick={() =>
              setHoveredRoute((current) => (current === point.label ? null : point.label))
            }
            tabIndex={0}
            role="button"
            aria-label={point.label}
          />
        ))}
      </svg>

      {mounted && activeRoute && pinScreenPos ? (
        <RoutePointTooltip x={pinScreenPos.x} y={pinScreenPos.y} label={activeRoute.label} />
      ) : null}
    </div>
  );
}
