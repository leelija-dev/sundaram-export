"use client";

import { useMemo, useState } from "react";
import {
  COUNTRY_DOT_COLORS,
  COUNTRY_MARKERS,
  generateAsiaMapDots,
  lonLatToMapXY,
  MAP_HEIGHT,
  MAP_WIDTH,
  type CountryId,
  type CountryMarker,
} from "@/lib/asia-map-land";

const ASIA_DOTS = generateAsiaMapDots();

function MapPin({
  marker,
  active,
  onEnter,
  onLeave,
}: {
  marker: CountryMarker;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const { x, y } = lonLatToMapXY(marker.lon, marker.lat);
  const isHub = marker.hub;
  const pinColor = isHub ? "#f59e0b" : "#2563eb";
  const scale = isHub ? 1.15 : 1;
  const showLabel = isHub || active;
  const { x: lx, y: ly } = marker.labelOffset;
  const labelBelow = ly > 0;
  const boxY = labelBelow ? 2 : marker.subtitle ? -9 : -6.5;
  const titleY = labelBelow ? 5.5 : marker.subtitle ? -5.5 : -2.8;
  const subtitleY = -1.8;

  return (
    <g
      className="export-map-marker"
      transform={`translate(${x}, ${y}) scale(${scale})`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}
    >
      {isHub && (
        <>
          <circle r="7" fill="none" stroke="#f59e0b" strokeWidth="0.35" opacity="0.5" className="export-map-ping" />
          <circle r="5" fill="#f59e0b" opacity="0.18" className="export-map-pulse" />
        </>
      )}
      {active && !isHub && <circle r="5.5" fill="#2563eb" opacity="0.15" />}

      <path
        d="M0 -4.8 C-1.2 -7.6 -3.8 -6.2 -3.8 -3.8 C-3.8 -1.5 -0.15 1.3 0 2.6 C0.15 1.3 3.8 -1.5 3.8 -3.8 C3.8 -6.2 1.2 -7.6 0 -4.8 Z"
        fill={active || isHub ? pinColor : "#3b82f6"}
        stroke={isHub ? "#fcd34d" : "#93c5fd"}
        strokeWidth="0.35"
      />
      <circle cy="-3.8" r="1.1" fill="white" />

      {showLabel && (
        <g transform={`translate(${lx}, ${ly})`}>
          <rect
            x={isHub ? -15 : -11.5}
            y={boxY}
            width={isHub ? 30 : 23}
            height={marker.subtitle ? 9.5 : 6.5}
            rx="1.6"
            fill="rgba(0,0,0,0.9)"
            stroke={isHub ? "rgba(245,158,11,0.8)" : "rgba(37,99,235,0.6)"}
            strokeWidth="0.3"
          />
          <text
            textAnchor="middle"
            y={titleY}
            fill="white"
            fontSize="2.4"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            {marker.name.toUpperCase()}
          </text>
          {marker.subtitle && !labelBelow && (
            <text textAnchor="middle" y={subtitleY} fill="#fbbf24" fontSize="1.75" fontWeight="600">
              {marker.subtitle}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

export function ExportRegionMap() {
  const [activeId, setActiveId] = useState<CountryId>("india");
  const indiaPos = useMemo(() => lonLatToMapXY(79, 21), []);

  return (
    <article className="export-map-card">
      <header className="export-map-header">
        <p className="export-map-region-label">South Asia export corridor</p>
        <p className="export-map-region-hint">Hover a country to explore export destinations</p>
      </header>

      <div className="export-map-canvas">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="export-map-svg export-map-svg-asia"
          role="img"
          aria-label="Dotted South Asia map: India, Pakistan, Bangladesh, and Sri Lanka"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#000000" rx="4" />

          {ASIA_DOTS.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={dot.country === "india" ? 0.7 : 0.58}
              fill={dot.country ? COUNTRY_DOT_COLORS[dot.country] : "rgba(255,255,255,0.3)"}
            />
          ))}

          <ellipse
            cx={indiaPos.x}
            cy={indiaPos.y}
            rx="20"
            ry="16"
            fill="rgba(245,158,11,0.08)"
          />

          {COUNTRY_MARKERS.map((marker) => (
            <MapPin
              key={marker.id}
              marker={marker}
              active={activeId === marker.id}
              onEnter={() => setActiveId(marker.id)}
              onLeave={() => setActiveId("india")}
            />
          ))}
        </svg>
      </div>

      <footer className="export-map-legend">
        {COUNTRY_MARKERS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`export-map-legend-item ${activeId === m.id ? "active" : ""} ${m.hub ? "hub" : ""}`}
            onMouseEnter={() => setActiveId(m.id)}
            onFocus={() => setActiveId(m.id)}
            aria-pressed={activeId === m.id}
          >
            <span className="export-map-legend-pin" aria-hidden />
            {m.name}
          </button>
        ))}
      </footer>
    </article>
  );
}
