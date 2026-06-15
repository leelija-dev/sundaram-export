/** Shared equirectangular map layout — keeps hero map image and SVG overlay aligned. */

export const MAP_VIEW_W = 1000;
export const MAP_VIEW_H = 500;

export type MapBreakpoint = "mobile" | "tablet" | "lg" | "desktop";

export type MapObjectPosition = { x: number; y: number };

export const HUB_LON_LAT = { lon: 88.36, lat: 22.57 };

const HUB_PROJECTED = {
  x: ((HUB_LON_LAT.lon + 180) / 360) * MAP_VIEW_W,
  y: ((90 - HUB_LON_LAT.lat) / 180) * MAP_VIEW_H,
};

/** Hub anchor for map crop / zoom (Kolkata). */
export const HUB_MAP_RATIO = {
  x: HUB_PROJECTED.x / MAP_VIEW_W,
  y: HUB_PROJECTED.y / MAP_VIEW_H,
};

/** Slight zoom toward hub + nearest corridors. */
export const MAP_ZOOM: Record<MapBreakpoint, number> = {
  mobile: 1.04,
  tablet: 1.1,
  lg: 0.88,
  desktop: 1.15,
};

/**
 * Shift map window + anchor hub left-of-center in the viewport.
 * `ax` / `ay` = where the focus point sits in the visible frame (0–1).
 */
export const MAP_VIEW_FOCUS: Record<
  MapBreakpoint,
  { dx: number; dy: number; ax: number; ay: number }
> = {
  mobile: { dx: 18, dy: 22, ax: 0.4, ay: 0.52 },
  tablet: { dx: 34, dy: 14, ax: 0.36, ay: 0.5 },
  lg: { dx: -22, dy: -2, ax: 0.52, ay: 0.48 },
  desktop: { dx: 42, dy: 5, ax: 0.32, ay: 0.5 },
};

/** Clip map to the right column — at 1024px (lg) map lives in cols 8–12, not full bleed. */
export const MAP_CONTAINER_INSET: Record<MapBreakpoint, string> = {
  mobile: "left-[6%] right-[-6%] top-[38%] bottom-[22%]",
  tablet: "left-0 right-0 top-[26%] bottom-[17%]",
  lg: "left-[46%] right-[-3%] top-1/2 h-[min(88%,42rem)] -translate-y-1/2",
  desktop: "left-[32%] right-0 top-[4%] bottom-[11%]",
};

export const MAP_OBJECT_POSITION: Record<MapBreakpoint, MapObjectPosition> = {
  mobile: { x: HUB_MAP_RATIO.x, y: HUB_MAP_RATIO.y + 0.02 },
  tablet: { x: HUB_MAP_RATIO.x, y: HUB_MAP_RATIO.y },
  lg: { x: HUB_MAP_RATIO.x + 0.04, y: HUB_MAP_RATIO.y },
  desktop: { x: HUB_MAP_RATIO.x, y: HUB_MAP_RATIO.y - 0.01 },
};

export const MAP_LAYOUT: Record<
  MapBreakpoint,
  {
    mapOpacity: number;
    maskWidth: number;
    maskHeight: number;
    hubGlow: number;
    hubRadius: number;
    hubRing: number;
    pinRadius: number;
    pinInner: number;
    hitWidth: number;
    labelFont: number;
    arcLift: number;
  }
> = {
  mobile: {
    mapOpacity: 0.7,
    maskWidth: 62,
    maskHeight: 50,
    hubGlow: 24,
    hubRadius: 4,
    hubRing: 7.5,
    pinRadius: 2.5,
    pinInner: 1.05,
    hitWidth: 24,
    labelFont: 9,
    arcLift: 26,
  },
  tablet: {
    mapOpacity: 0.78,
    maskWidth: 52,
    maskHeight: 42,
    hubGlow: 28,
    hubRadius: 5,
    hubRing: 9,
    pinRadius: 3,
    pinInner: 1.25,
    hitWidth: 21,
    labelFont: 10,
    arcLift: 30,
  },
  lg: {
    mapOpacity: 0.8,
    maskWidth: 88,
    maskHeight: 68,
    hubGlow: 32,
    hubRadius: 5.5,
    hubRing: 10,
    pinRadius: 3.25,
    pinInner: 1.3,
    hitWidth: 19,
    labelFont: 10,
    arcLift: 30,
  },
  desktop: {
    mapOpacity: 0.84,
    maskWidth: 44,
    maskHeight: 36,
    hubGlow: 34,
    hubRadius: 6.5,
    hubRing: 11,
    pinRadius: 3.75,
    pinInner: 1.5,
    hitWidth: 18,
    labelFont: 11,
    arcLift: 36,
  },
};

export function getMapBreakpoint(width: number): MapBreakpoint {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1280) return "lg";
  return "desktop";
}

export function projectLonLat(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 360) * MAP_VIEW_W,
    y: ((90 - lat) / 180) * MAP_VIEW_H,
  };
}

/** Visible map window — hub-centered zoom; matches SVG viewBox + embedded map image. */
export function computeHubFocusedViewBox(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  zoom: number,
  hubX = HUB_PROJECTED.x,
  hubY = HUB_PROJECTED.y,
  focusDx = 0,
  focusDy = 0,
  focusAx = 0.5,
  focusAy = 0.5
) {
  if (containerW <= 0 || containerH <= 0) {
    return { x: 0, y: 0, w: imageW, h: imageH };
  }

  const aspect = containerW / containerH;
  let visH = imageH / zoom;
  let visW = visH * aspect;

  if (visW > imageW) {
    visW = imageW;
    visH = visW / aspect;
  }
  if (visH > imageH) {
    visH = imageH;
    visW = visH * aspect;
  }

  const focusX = hubX + focusDx;
  const focusY = hubY + focusDy;
  let x = focusX - visW * focusAx;
  let y = focusY - visH * focusAy;
  x = Math.max(0, Math.min(x, imageW - visW));
  y = Math.max(0, Math.min(y, imageH - visH));

  return { x, y, w: visW, h: visH };
}

/** @deprecated Use computeHubFocusedViewBox — kept for compatibility. */
export function computeObjectCoverViewBox(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  _posX: number,
  _posY: number,
  zoom = 1,
  hubX = HUB_PROJECTED.x,
  hubY = HUB_PROJECTED.y,
  focusDx = 0,
  focusDy = 0,
  focusAx = 0.5,
  focusAy = 0.5
) {
  return computeHubFocusedViewBox(
    containerW,
    containerH,
    imageW,
    imageH,
    zoom,
    hubX,
    hubY,
    focusDx,
    focusDy,
    focusAx,
    focusAy
  );
}

export function formatViewBox(box: { x: number; y: number; w: number; h: number }) {
  return `${box.x} ${box.y} ${box.w} ${box.h}`;
}

export function resolveMapFocus(
  bp: MapBreakpoint,
  containerLeft: number,
  containerWidth: number,
  viewportWidth: number
) {
  const focus = { ...MAP_VIEW_FOCUS[bp] };

  if (bp === "lg" && containerWidth > 0 && viewportWidth > 0) {
    const targetHubX = viewportWidth * 0.735;
    const hubRatioInContainer = (targetHubX - containerLeft) / containerWidth;
    focus.ax = Math.min(0.6, Math.max(0.4, hubRatioInContainer));
  }

  return focus;
}

export function hubPositionInViewBox(
  hubX: number,
  hubY: number,
  box: { x: number; y: number; w: number; h: number }
) {
  const rx = Math.min(1, Math.max(0, (hubX - box.x) / box.w));
  const ry = Math.min(1, Math.max(0, (hubY - box.y) / box.h));
  return {
    x: `${rx * 100}%`,
    y: `${ry * 100}%`,
  };
}

export function buildHubMask(
  maskWidth: number,
  maskHeight: number,
  hubMaskX: string,
  hubMaskY: string
) {
  return {
    hubMaskX,
    hubMaskY,
    mask: `radial-gradient(ellipse ${maskWidth}% ${maskHeight}% at ${hubMaskX} ${hubMaskY}, black 0%, rgba(0,0,0,0.94) 14%, rgba(0,0,0,0.78) 28%, rgba(0,0,0,0.5) 48%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.06) 88%, transparent 100%)`,
  };
}
