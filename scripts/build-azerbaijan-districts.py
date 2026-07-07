"""
Regenerate frontend/src/app/data/azerbaijanDistricts.json from geoBoundaries ADM2 data.

Source: geoBoundaries Azerbaijan ADM2 (CC BY 4.0)
https://www.geoboundaries.org/
"""

from __future__ import annotations

import json
import ssl
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend/src/app/data/azerbaijanDistricts.json"

DISTRICT_TO_REGION = {
    "Absheron District": "Abşeron-Xızı",
    "Khizi District": "Abşeron-Xızı",
    "Sumqayit City": "Abşeron-Xızı",
    "Dashkasan District": "Gəncə-Daşkəsən",
    "Goranboy District": "Gəncə-Daşkəsən",
    "Goygol District": "Gəncə-Daşkəsən",
    "Samukh District": "Gəncə-Daşkəsən",
    "Ganja City": "Gəncə-Daşkəsən",
    "Naftalan City": "Gəncə-Daşkəsən",
    "Balakan District": "Şəki-Zaqatala",
    "Qakh District": "Şəki-Zaqatala",
    "Qabala District": "Şəki-Zaqatala",
    "Oghuz District": "Şəki-Zaqatala",
    "Zaqatala District": "Şəki-Zaqatala",
    "Shaki City": "Şəki-Zaqatala",
    "Shaki District": "Şəki-Zaqatala",
    "Astara District": "Lənkəran-Astara",
    "Jalilabad District": "Lənkəran-Astara",
    "Lankaran City": "Lənkəran-Astara",
    "Lankaran District": "Lənkəran-Astara",
    "Lerik District": "Lənkəran-Astara",
    "Masally District": "Lənkəran-Astara",
    "Yardymli District": "Lənkəran-Astara",
    "Shabran District": "Quba-Xaçmaz",
    "Khachmaz District": "Quba-Xaçmaz",
    "Quba District": "Quba-Xaçmaz",
    "Qusar District": "Quba-Xaçmaz",
    "Siazan District": "Quba-Xaçmaz",
    "Agdash District": "Mərkəzi Aran",
    "Goychay District": "Mərkəzi Aran",
    "Kurdamir District": "Mərkəzi Aran",
    "Ujar District": "Mərkəzi Aran",
    "Yevlakh City": "Mərkəzi Aran",
    "Yevlakh District": "Mərkəzi Aran",
    "Zardab District": "Mərkəzi Aran",
    "Mingachevir City": "Mərkəzi Aran",
    "Aghjabadi District": "Qarabağ",
    "Agdam District": "Qarabağ",
    "Barda District": "Qarabağ",
    "Fuzuli District": "Qarabağ",
    "Khojaly District": "Qarabağ",
    "Khojavend District": "Qarabağ",
    "Shusha City": "Qarabağ",
    "Shusha District": "Qarabağ",
    "Tartar District": "Qarabağ",
    "Khankendi City": "Qarabağ",
    "Kalbajar District": "Şərqi Zəngəzur",
    "Qubadli District": "Şərqi Zəngəzur",
    "Zangilan District": "Şərqi Zəngəzur",
    "Lachin District": "Şərqi Zəngəzur",
    "Jabrayil District": "Şərqi Zəngəzur",
    "Agsu District": "Dağlıq Şirvan",
    "Ismailli District": "Dağlıq Şirvan",
    "Gobustan District": "Dağlıq Şirvan",
    "Shamakhi District": "Dağlıq Şirvan",
    "Babek District": "Naxçıvan",
    "Julfa District": "Naxçıvan",
    "Kangarli District": "Naxçıvan",
    "Ordubad District": "Naxçıvan",
    "Sadarak District": "Naxçıvan",
    "Shahbuz District": "Naxçıvan",
    "Sharur District": "Naxçıvan",
    "Nakhchivan City": "Naxçıvan",
    "Baku City": "Bakı",
    "Agstafa District": "Qazax-Tovuz",
    "Gadabay District": "Qazax-Tovuz",
    "Qazakh District": "Qazax-Tovuz",
    "Shamkir District": "Qazax-Tovuz",
    "Tovuz District": "Qazax-Tovuz",
    "Beylagan District": "Mil-Muğan",
    "Imishli District": "Mil-Muğan",
    "Saatly District": "Mil-Muğan",
    "Sabirabad District": "Mil-Muğan",
    "Bilasuvar District": "Şirvan-Salyan",
    "Hajigabul District": "Şirvan-Salyan",
    "Neftchala District": "Şirvan-Salyan",
    "Salyan District": "Şirvan-Salyan",
    "Shirvan City": "Şirvan-Salyan",
}


def round_coords(obj, precision=4):
    if isinstance(obj, float):
        return round(obj, precision)
    if isinstance(obj, list):
        return [round_coords(x, precision) for x in obj]
    return obj


def main() -> None:
    ctx = ssl._create_unverified_context()
    url = (
        "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/"
        "releaseData/gbOpen/AZE/ADM2/geoBoundaries-AZE-ADM2.geojson"
    )
    geojson = json.loads(urllib.request.urlopen(url, context=ctx, timeout=120).read())

    features_out = []
    seen_ids: set[str] = set()
    for feat in geojson["features"]:
        name = feat["properties"]["shapeName"]
        sid = feat["properties"]["shapeID"]
        if sid in seen_ids:
            continue
        seen_ids.add(sid)
        region = DISTRICT_TO_REGION.get(name)
        if not region:
            raise ValueError(f"Unmapped district: {name}")
        features_out.append(
            {
                "type": "Feature",
                "properties": {
                    "district": name,
                    "economicRegion": region,
                    "shapeID": sid,
                },
                "geometry": {
                    "type": feat["geometry"]["type"],
                    "coordinates": round_coords(feat["geometry"]["coordinates"], 4),
                },
            }
        )

    OUT.write_text(
        json.dumps({"type": "FeatureCollection", "features": features_out}, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Wrote {len(features_out)} features to {OUT}")


if __name__ == "__main__":
    main()
