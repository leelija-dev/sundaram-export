"""Generate responsive world-map SVG assets from GeoJSON country boundaries."""
from __future__ import annotations

import argparse
import json
import urllib.request
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "maps"
GEOJSON_URL = (
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
)

W, H = 1000, 500
FILL = "#cbd5e1"
STROKE = "#e2e8f0"


def project(lon: float, lat: float) -> tuple[float, float]:
    return (lon + 180) / 360 * W, (90 - lat) / 180 * H


def ring_to_path(ring: list, precision: int) -> str:
    if not ring:
        return ""
    x0, y0 = project(ring[0][0], ring[0][1])
    parts = [f"M {x0:.{precision}f} {y0:.{precision}f}"]
    for lon, lat in ring[1:]:
        x, y = project(lon, lat)
        parts.append(f"L {x:.{precision}f} {y:.{precision}f}")
    parts.append("Z")
    return " ".join(parts)


def geom_to_paths(geom: dict, precision: int) -> list[str]:
    geom_type = geom["type"]
    coords = geom["coordinates"]
    paths: list[str] = []
    if geom_type == "Polygon":
        paths.append(ring_to_path(coords[0], precision))
    elif geom_type == "MultiPolygon":
        for poly in coords:
            paths.append(ring_to_path(poly[0], precision))
    return paths


def build_svg(path_els: list[str], *, compact: bool) -> str:
    variant = "compact" if compact else "full"
    return f"""<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 {W} {H}"
  width="100%"
  height="100%"
  preserveAspectRatio="xMidYMid slice"
  role="img"
  aria-label="World map"
  data-map-variant="{variant}">
  <style>
    .land {{
      fill: {FILL};
      fill-opacity: 0.82;
      stroke: {STROKE};
      stroke-opacity: 0.35;
      vector-effect: non-scaling-stroke;
    }}
    @media (max-width: 639px) {{
      .land {{
        fill-opacity: 0.78;
        stroke-width: 0.45;
      }}
    }}
    @media (min-width: 640px) and (max-width: 1023px) {{
      .land {{
        fill-opacity: 0.8;
        stroke-width: 0.38;
      }}
    }}
    @media (min-width: 1024px) {{
      .land {{
        fill-opacity: 0.82;
        stroke-width: 0.35;
      }}
    }}
  </style>
{chr(10).join(path_els)}
</svg>
"""


def generate(*, compact: bool) -> Path:
    precision = 1 if compact else 2
    outfile = OUT_DIR / ("world-map-compact.svg" if compact else "world-map.svg")

    with urllib.request.urlopen(GEOJSON_URL, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    path_els: list[str] = []
    for feature in data["features"]:
        for d in geom_to_paths(feature["geometry"], precision):
            if d:
                path_els.append(f'  <path class="land" d="{d}"/>')

    outfile.write_text(build_svg(path_els, compact=compact), encoding="utf-8")
    return outfile


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate responsive world map SVG assets.")
    parser.add_argument(
        "--variant",
        choices=("all", "full", "compact"),
        default="all",
        help="Which SVG variant(s) to write.",
    )
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    variants = ["full", "compact"] if args.variant == "all" else [args.variant]

    for variant in variants:
        path = generate(compact=variant == "compact")
        print(f"Wrote {path} ({path.stat().st_size} bytes)")

    print(f"viewBox: 0 0 {W} {H}")


if __name__ == "__main__":
    main()
