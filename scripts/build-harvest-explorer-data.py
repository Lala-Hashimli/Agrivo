"""Build filtered fresh-produce regional data from azerbaycan_rayon_mehsul_siyahisi.xlsx."""
from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
EXCEL = Path.home() / "Downloads" / "azerbaycan_rayon_mehsul_siyahisi.xlsx"
OUT = ROOT / "frontend" / "src" / "app" / "data" / "harvestExplorerData.json"

ALLOWED_KEYWORDS = {
    "alma": "Apple",
    "armud": "Pear",
    "gilas": "Cherry",
    "gavalı": "Plum",
    "nar": "Pomegranate",
    "üzüm": "Grapes",
    "sitrus": "Citrus",
    "limon": "Citrus",
    "portağal": "Citrus",
    "mandarin": "Citrus",
    "pomidor": "Tomato",
    "tomat": "Tomato",
    "xiyar": "Cucumber",
    "kartof": "Potato",
    "soğan": "Onion",
    "kələm": "Cabbage",
    "bibər": "Pepper",
    "badımcan": "Eggplant",
    "tərəvəz": "Vegetables",
    "meyvə": "Fruits",
    "bostan": "Watermelon",
    "qarpız": "Watermelon",
    "yemiş": "Melon",
    "istixana": "Greenhouse",
    "farəş": "Vegetables",
    "subtropik": "Citrus",
    "zeytun": "Vegetables",
}

EXCLUDED_KEYWORDS = [
    "taxıl",
    "pambıq",
    "tütün",
    "çay",
    "fındıq",
    "qoz",
    "qoyun",
    "mal-qara",
    "quş",
    "süd",
    "sənaye",
    "neft",
    "qərzəkli",
]


def split_products(text: str) -> list[str]:
    if not text or text.strip() in {"-", ""}:
        return []
    return [p.strip() for p in re.split(r"[;,/]", text) if p.strip()]


def is_excluded_token(token: str) -> bool:
    lower = token.lower()
    return any(ex in lower for ex in EXCLUDED_KEYWORDS)


def map_token(token: str) -> str | None:
    if is_excluded_token(token):
        return None
    lower = token.lower()
    for key, label in ALLOWED_KEYWORDS.items():
        if key in lower:
            return label
    return None


def extract_fresh_products(direction_text: str, group_text: str) -> list[str]:
    products: list[str] = []
    seen: set[str] = set()
    for token in split_products(direction_text):
        mapped = map_token(token)
        if mapped and mapped not in seen:
            seen.add(mapped)
            products.append(mapped)

    group = (group_text or "").lower()
    if not products:
        if "tərəvəz" in group:
            products.append("Vegetables")
        if "meyvə" in group:
            products.append("Fruits")
        if "bostan" in group:
            products.append("Watermelon")
        if "üzüm" in group:
            products.append("Grapes")
        if "kartof" in group:
            products.append("Potato")

    return products


def main() -> None:
    wb = openpyxl.load_workbook(EXCEL, read_only=True, data_only=True)
    ws = wb["Rayon-məhsul siyahısı"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    districts = []
    region_stats: dict[str, dict] = defaultdict(lambda: {"districts": 0, "freshDistricts": 0, "products": defaultdict(int)})

    for row in rows[1:]:
        if not row or not row[1]:
            continue
        region, district, direction, group = row[0], row[1], row[2], row[3]
        fresh = extract_fresh_products(str(direction or ""), str(group or ""))
        districts.append(
            {
                "economicRegion": str(region).strip(),
                "district": str(district).strip(),
                "directionRaw": str(direction or "").strip(),
                "groupRaw": str(group or "").strip(),
                "rationale": str(row[4] or "").strip() if len(row) > 4 else "",
                "reliability": str(row[5] or "").strip() if len(row) > 5 else "",
                "freshProducts": fresh,
                "hasFreshProduce": len(fresh) > 0,
            }
        )
        stats = region_stats[str(region).strip()]
        stats["districts"] += 1
        if fresh:
            stats["freshDistricts"] += 1
            for product in fresh:
                stats["products"][product] += 1

    regions = []
    for name, stats in region_stats.items():
        top = sorted(stats["products"].items(), key=lambda item: -item[1])[:5]
        regions.append(
            {
                "name": name,
                "districtCount": stats["districts"],
                "freshDistrictCount": stats["freshDistricts"],
                "topProducts": [product for product, _ in top],
                "productCounts": dict(stats["products"]),
            }
        )

    payload = {
        "source": EXCEL.name,
        "generatedAt": "2026-07-04",
        "districts": districts,
        "regions": sorted(regions, key=lambda item: item["name"]),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({len(districts)} districts, {len(regions)} regions)")


if __name__ == "__main__":
    main()
