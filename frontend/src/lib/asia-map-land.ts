/** South Asia dotted map — regional projection & country land masks */

export type MapDot = {
  x: number;
  y: number;
  country?: CountryId;
};

export type CountryId = "india" | "pakistan" | "bangladesh" | "sri-lanka";

export const ASIA_BOUNDS = {
  west: 64,
  east: 93,
  south: 5.5,
  north: 35.5,
} as const;

export const MAP_WIDTH = 200;
export const MAP_HEIGHT = 175;

function inRect(lon: number, lat: number, w: number, s: number, e: number, n: number) {
  return lon >= w && lon <= e && lat >= s && lat <= n;
}

function inEllipse(lon: number, lat: number, cx: number, cy: number, rx: number, ry: number) {
  const dx = (lon - cx) / rx;
  const dy = (lat - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function inBounds(lon: number, lat: number) {
  const b = ASIA_BOUNDS;
  return lon >= b.west && lon <= b.east && lat >= b.south && lat <= b.north;
}

function isPakistan(lon: number, lat: number) {
  if (inEllipse(lon, lat, 68.5, 30, 5.5, 5.8) && lat >= 24) return true;
  if (inRect(lon, lat, 64, 24, 72, 32)) return true;
  if (inRect(lon, lat, 66, 28, 74, 35)) return true;
  return false;
}

function isIndia(lon: number, lat: number) {
  if (inRect(lon, lat, 72, 28, 88, 35)) return true;
  if (inEllipse(lon, lat, 80, 23, 9, 5.5) && lon >= 73 && lon <= 88) return true;
  if (inEllipse(lon, lat, 77, 15, 3.5, 6.5) && lat >= 8 && lat <= 22) return true;
  if (inRect(lon, lat, 68, 20, 74, 28)) return true;
  if (inRect(lon, lat, 84, 18, 89.5, 27)) return true;
  if (inRect(lon, lat, 80, 26, 88, 30)) return true;
  return false;
}

function isBangladesh(lon: number, lat: number) {
  return inEllipse(lon, lat, 90.5, 23.5, 2.3, 3.2);
}

function isSriLanka(lon: number, lat: number) {
  return inEllipse(lon, lat, 80.7, 7.5, 2, 2.3);
}

export function getCountryAt(lon: number, lat: number): CountryId | null {
  if (!inBounds(lon, lat)) return null;
  if (isSriLanka(lon, lat)) return "sri-lanka";
  if (isBangladesh(lon, lat)) return "bangladesh";
  if (isPakistan(lon, lat) && !isIndia(lon, lat)) return "pakistan";
  if (isIndia(lon, lat)) return "india";
  return null;
}

export function isAsiaLand(lon: number, lat: number) {
  return getCountryAt(lon, lat) !== null;
}

export function lonLatToMapXY(lon: number, lat: number, width = MAP_WIDTH, height = MAP_HEIGHT) {
  const b = ASIA_BOUNDS;
  return {
    x: ((lon - b.west) / (b.east - b.west)) * width,
    y: ((b.north - lat) / (b.north - b.south)) * height,
  };
}
export function generateAsiaMapDots(
  width = MAP_WIDTH,
  height = MAP_HEIGHT,
  step = 1.65
): MapDot[] {
  const dots: MapDot[] = [];
  const b = ASIA_BOUNDS;

  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const lon = b.west + (x / width) * (b.east - b.west);
      const lat = b.north - (y / height) * (b.north - b.south);
      const country = getCountryAt(lon, lat);
      if (!country) continue;
      dots.push({ x, y, country });
    }
  }
  return dots;
}

export const COUNTRY_DOT_COLORS: Record<CountryId, string> = {
  india: "rgba(255,255,255,0.62)",
  pakistan: "rgba(255,255,255,0.48)",
  bangladesh: "rgba(255,255,255,0.48)",
  "sri-lanka": "rgba(255,255,255,0.48)",
};

export type CountryMarker = {
  id: CountryId;
  name: string;
  lon: number;
  lat: number;
  hub?: boolean;
  subtitle?: string;
  labelOffset: { x: number; y: number };
};

export const COUNTRY_MARKERS: CountryMarker[] = [
  {
    id: "pakistan",
    name: "Pakistan",
    lon: 69.5,
    lat: 29.5,
    labelOffset: { x: 0, y: -12 },
  },
  {
    id: "india",
    name: "India",
    lon: 79,
    lat: 21,
    hub: true,
    subtitle: "Global Export Hub",
    labelOffset: { x: 0, y: -13 },
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    lon: 90.5,
    lat: 23.8,
    labelOffset: { x: 0, y: -12 },
  },
  {
    id: "sri-lanka",
    name: "Sri Lanka",
    lon: 80.7,
    lat: 7.5,
    labelOffset: { x: 0, y: 11 },
  },
];

