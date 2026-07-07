export function districtShortName(district: string) {
  return district
    .replace(/\s*rayonu$/i, "")
    .replace(/\s*şəhəri$/i, "")
    .replace(/\s*\/şəhəri$/i, "")
    .trim();
}

export function geoDistrictShortLabel(district: string) {
  return district
    .replace(/\s+District$/i, "")
    .replace(/\s+City$/i, "")
    .trim();
}

function normalizeDistrictKey(value: string) {
  return geoDistrictShortLabel(districtShortName(value))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]/g, "");
}

export function districtsMatchGeo(geoDistrict: string, selectedDistrict: string) {
  if (selectedDistrict === "all") return false;
  const geo = geoDistrictShortLabel(geoDistrict).toLowerCase();
  const selected = districtShortName(selectedDistrict).toLowerCase();
  if (geo === selected) return true;
  if (geo.includes(selected) || selected.includes(geo)) return true;

  const geoKey = normalizeDistrictKey(geoDistrict);
  const selectedKey = normalizeDistrictKey(selectedDistrict);
  if (geoKey && selectedKey && (geoKey === selectedKey || geoKey.includes(selectedKey) || selectedKey.includes(geoKey))) {
    return true;
  }

  return geo.slice(0, 4) === selected.slice(0, 4);
}

export function formatProductTypeLabel(productType: string) {
  const labels: Record<string, string> = {
    Fruits: "fruits",
    Vegetables: "vegetables",
    Tomato: "tomato",
    Potato: "potato",
    Apple: "apple",
    Pomegranate: "pomegranate",
    Cucumber: "cucumber",
    Grapes: "grapes",
    Citrus: "citrus",
    Watermelon: "watermelon",
    Onion: "onion",
    Pepper: "pepper",
    Eggplant: "eggplant",
    Pear: "pear",
    Cherry: "cherry",
    Melon: "melon",
    Greenhouse: "greenhouse",
  };
  return labels[productType] ?? productType.toLowerCase();
}

export function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const PRODUCT_PIN: Record<string, string> = {
  Tomato: "🍅",
  Apple: "🍎",
  Potato: "🥔",
  Grapes: "🍇",
  Citrus: "🍊",
  Watermelon: "🍉",
  Cucumber: "🥒",
  Eggplant: "🍆",
  Onion: "🧅",
  Pomegranate: "🍎",
  Vegetables: "🥬",
  Fruits: "🍎",
  Pepper: "🫑",
  Pear: "🍐",
  Cherry: "🍒",
  Melon: "🍉",
  Greenhouse: "🌿",
};

export function productPin(productType: string) {
  return PRODUCT_PIN[productType] ?? "🥬";
}
