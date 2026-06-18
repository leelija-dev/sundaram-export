"""Normalize saved report JSON for template display."""

from __future__ import annotations


def normalize_report_display(data: dict | None) -> dict:
    data = data or {}
    if data.get("schema_version") == 2:
        return data
    return _legacy_to_v2(data)


def _legacy_to_v2(data: dict) -> dict:
    kpis: list[dict] = []
    sections: list[dict] = []

    if "total" in data:
        kpis.append({"label": "Total inquiries", "value": str(data["total"]), "note": ""})
    if "win_rate_pct" in data:
        kpis.append({"label": "Win rate", "value": f"{data['win_rate_pct']}%", "note": ""})
    if "products" in data:
        kpis.append({"label": "Products", "value": str(data["products"]), "note": ""})

    for key in ("by_status", "by_type", "pipeline", "destinations"):
        value = data.get(key)
        if isinstance(value, dict) and value:
            sections.append(
                {
                    "title": key.replace("_", " ").title(),
                    "type": "table",
                    "headers": ["Item", "Count"],
                    "rows": [[str(k), str(v)] for k, v in value.items()],
                }
            )

    period = data.get("period") or {}
    return {
        "schema_version": 2,
        "company": "",
        "generated_at": data.get("generated_at", ""),
        "period": {
            "from": period.get("from"),
            "to": period.get("to"),
            "label": "Legacy snapshot",
        },
        "summary": "Archived report (generated before the professional export format).",
        "kpis": kpis,
        "sections": sections,
    }
