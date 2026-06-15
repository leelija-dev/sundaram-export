export type MarketRegion = {
  id: string;
  name: string;
  description: string;
  countries: string[];
  keyPorts: string[];
  specialties: string[];
};

export const marketRegions: MarketRegion[] = [
  {
    id: "north-america",
    name: "North America",
    description:
      "Direct lanes to US East Coast, Gulf, and West Coast with FDA/USDA coordination for agri and food exports.",
    countries: ["United States", "Canada", "Mexico"],
    keyPorts: ["Houston", "Los Angeles", "New York / NJ", "Vancouver"],
    specialties: ["Spices", "Textiles", "Engineering goods", "Seafood"],
  },
  {
    id: "europe",
    name: "Europe",
    description:
      "Rotterdam, Hamburg, and Felixstowe gateways with REACH compliance support for chemicals and textiles.",
    countries: ["Germany", "Netherlands", "UK", "France", "Italy", "Spain", "Poland"],
    keyPorts: ["Rotterdam", "Hamburg", "Felixstowe", "Antwerp"],
    specialties: ["Chemicals", "Textiles", "Handicrafts", "Rice & pulses"],
  },
  {
    id: "gcc-mena",
    name: "GCC & Middle East",
    description:
      "High-volume basmati, spices, and construction materials with halal and label compliance for retail chains.",
    countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "Egypt"],
    keyPorts: ["Jebel Ali", "Dammam", "Sohar", "Jeddah"],
    specialties: ["Basmati rice", "Spices", "Engineering", "Processed foods"],
  },
  {
    id: "africa",
    name: "Africa",
    description:
      "Growing corridors to East and West Africa with consolidated LCL and trade finance structures for distributors.",
    countries: ["Kenya", "Nigeria", "South Africa", "Tanzania", "Ghana", "Ethiopia"],
    keyPorts: ["Mombasa", "Lagos (Apapa)", "Durban", "Dar es Salaam"],
    specialties: ["Pulses", "Textiles", "Chemicals", "Auto parts"],
  },
  {
    id: "asia-pacific",
    name: "Asia-Pacific",
    description:
      "Intra-Asia redistribution and direct exports to ASEAN, Japan, and Australia with FTA utilization.",
    countries: ["Singapore", "Japan", "Australia", "Vietnam", "Indonesia", "South Korea"],
    keyPorts: ["Singapore", "Tokyo / Yokohama", "Sydney", "Ho Chi Minh"],
    specialties: ["Spices", "Pharma intermediates", "Seafood", "IT hardware"],
  },
  {
    id: "latin-america",
    name: "Latin America",
    description:
      "Emerging demand for dyes, intermediates, and engineering goods via Santos and Buenos Aires hubs.",
    countries: ["Brazil", "Chile", "Colombia", "Peru", "Argentina"],
    keyPorts: ["Santos", "Buenos Aires", "Callao", "Cartagena"],
    specialties: ["Dyes", "Chemical intermediates", "Castings"],
  },
];

export function getMarketById(id: string) {
  return marketRegions.find((m) => m.id === id);
}
