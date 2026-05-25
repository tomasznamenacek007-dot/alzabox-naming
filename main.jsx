
const DEMO_FALLBACKS = [
  {
    lat: "50.027472", lng: "14.559194", city: "Praha", district: "Křeslice",
    street: "K Fantovu mlýnu", pois: ["Penny"], preferredName: "P10 - Křeslice - K Fantovu mlýnu"
  },
  {
    lat: "50.061160", lng: "14.427740", city: "Praha", district: "Nusle",
    street: "5. května", pois: ["OMV", "Kongresové centrum"], preferredName: "P4 - Nusle (OMV u Kongresového centra)"
  }
];

function normalize(value) {
  return String(value || "").trim().replace(",", ".");
}

function num(value) {
  const n = Number(normalize(value));
  return Number.isFinite(n) ? n : null;
}

function pickRegional(regionalStructure = [], type) {
  const item = regionalStructure.find((r) => r.type === type || r.Type === type);
  return item?.name || item?.Name || "";
}

function normalizeMapyEntity(entity) {
  const regional = entity.regionalStructure || entity.regional_structure || [];
  const name = entity.name || "";
  const location = entity.location || "";

  const city =
    pickRegional(regional, "regional.municipality") ||
    pickRegional(regional, "municipality") ||
    location.split(",")[0]?.trim() ||
    "";

  const district =
    pickRegional(regional, "regional.municipality_part") ||
    pickRegional(regional, "municipality_part") ||
    "";

  const street =
    pickRegional(regional, "regional.street") ||
    (entity.type === "regional.street" ? name : "") ||
    "";

  return { city, district, street, rawName: name, rawLocation: location };
}

async function callMapyReverse(lat, lng, apiKey) {
  const url = new URL("https://api.mapy.com/v1/geocode/reverse");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lng);
  url.searchParams.set("lang", "cs");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString());
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Mapy reverse geocoding chyba: ${response.status} ${text.slice(0, 160)}`);
  }

  return JSON.parse(text);
}

async function callMapyPoiSearch(lat, lng, apiKey) {
  const queries = ["Kaufland", "Tesco", "Penny", "Albert", "Billa", "Globus", "OMV", "KFC", "restaurace", "hospoda"];
  const pois = [];

  for (const query of queries) {
    try {
      const url = new URL("https://api.mapy.com/v1/geocode");
      url.searchParams.set("query", query);
      url.searchParams.set("type", "poi");
      url.searchParams.set("limit", "1");
      url.searchParams.set("lang", "cs");
      url.searchParams.set("preferNear", `${lng},${lat}`);
      url.searchParams.set("apikey", apiKey);

      const response = await fetch(url.toString());
      if (!response.ok) continue;
      const data = await response.json();
      const item = (data.items || data.results || [])[0];
      if (item?.name) pois.push(item.name);
    } catch {
      // POI hledání je doplňkové; když selže, reverse geocoding pořád vrátíme.
    }
  }

  return Array.from(new Set(pois)).slice(0, 5);
}

export default async function handler(req, res) {
  const lat = normalize(req.query.lat);
  const lng = normalize(req.query.lng);
  const latNumber = num(lat);
  const lngNumber = num(lng);

  if (latNumber === null || lngNumber === null) {
    return res.status(400).json({ error: "Neplatné GPS souřadnice." });
  }

  const apiKey = process.env.MAPY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Chybí MAPY_API_KEY ve Vercel Environment Variables.",
      source: "backend"
    });
  }

  try {
    const reverse = await callMapyReverse(lat, lng, apiKey);
    const entity = (reverse.items || reverse.results || [])[0];

    if (!entity) {
      return res.status(404).json({ error: "Mapy.cz nenašly pro GPS žádnou lokaci." });
    }

    const normalized = normalizeMapyEntity(entity);
    const pois = await callMapyPoiSearch(lat, lng, apiKey);

    return res.status(200).json({
      source: "Mapy.cz API",
      city: normalized.city,
      district: normalized.district,
      street: normalized.street || normalized.rawName,
      pois,
      raw: {
        reverseEntity: entity,
        note: "Raw data jsou tu jen pro ladění. Později je můžeme vypnout."
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Mapy.cz lookup selhal.",
      source: "backend"
    });
  }
}
