import { ProductCategory } from "./types";

export interface CategoryWithSvg extends ProductCategory {
  svg: string;
}

export const CATEGORIES: CategoryWithSvg[] = [
  // -------------------------------------------------------------
  // Civil & Interiors
  // -------------------------------------------------------------
  {
    id: "cement",
    name: "Cement",
    icon: "🧱",
    productCount: 12,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- UltraTech Yellow Bag -->
        <rect x="22" y="16" width="34" height="48" rx="4" fill="#F4D03F" stroke="#D4AC0D" stroke-width="1.5"/>
        <rect x="24" y="28" width="30" height="18" fill="#E74C3C" rx="1"/>
        <text x="39" y="38" font-size="7" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="sans-serif">UltraTech</text>
        <text x="39" y="44" font-size="4.5" font-weight="bold" fill="#F4D03F" text-anchor="middle" font-family="sans-serif">CEMENT</text>
        <rect x="26" y="52" width="16" height="3" rx="1" fill="#7D6608"/>
        <!-- ACC Red Bag Behind -->
        <rect x="12" y="24" width="22" height="38" rx="3" fill="#C0392B" stroke="#922B21" stroke-width="1.2" opacity="0.9"/>
        <text x="23" y="36" font-size="5.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="sans-serif">ACC</text>
        <rect x="15" y="42" width="16" height="2" fill="#F9E79F"/>
        <!-- White Cement Bag Left -->
        <rect x="48" y="26" width="20" height="36" rx="3" fill="#F8F9F9" stroke="#BDC3C7" stroke-width="1.2"/>
        <rect x="52" y="34" width="12" height="12" fill="#2980B9" rx="1"/>
        <text x="58" y="42" font-size="4.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle" font-family="sans-serif">BIRLA</text>
      </svg>
    `,
  },
  {
    id: "tiling",
    name: "Tiling",
    icon: "🔲",
    productCount: 28,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Background Tiles -->
        <rect x="14" y="18" width="26" height="26" rx="2" fill="#EAECEE" stroke="#BDC3C7" stroke-width="1"/>
        <rect x="42" y="18" width="26" height="26" rx="2" fill="#D5D8DC" stroke="#BDC3C7" stroke-width="1"/>
        <line x1="14" y1="31" x2="40" y2="31" stroke="#BDC3C7" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="27" y1="18" x2="27" y2="44" stroke="#BDC3C7" stroke-width="1" stroke-dasharray="2 2"/>
        <!-- Roff T01 Tile Adhesive Bag -->
        <rect x="25" y="24" width="30" height="42" rx="3" fill="#2ECC71" stroke="#27AE60" stroke-width="1.5"/>
        <rect x="27" y="33" width="26" height="16" fill="#F39C12" rx="1"/>
        <text x="40" y="42" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="sans-serif">Roff</text>
        <text x="40" y="47" font-size="4" font-weight="bold" fill="#145A32" text-anchor="middle" font-family="sans-serif">T01 ADHESIVE</text>
        <!-- Tile Spacers (Crosses) -->
        <path d="M18 56 H24 M21 53 V59" stroke="#E67E22" stroke-width="2" stroke-linecap="round"/>
        <path d="M60 54 H66 M63 51 V57" stroke="#E67E22" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: "painting",
    name: "Painting",
    icon: "🎨",
    productCount: 35,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Large Paint Bucket -->
        <path d="M22 28 L25 64 H55 L58 28 Z" fill="#EBF5FB" stroke="#2980B9" stroke-width="1.5"/>
        <ellipse cx="40" cy="28" rx="18" ry="4" fill="#3498DB"/>
        <rect x="25" y="36" width="30" height="16" fill="#E74C3C" rx="1"/>
        <text x="40" y="45" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="sans-serif">asianpaints</text>
        <text x="40" y="50" font-size="3.5" font-weight="bold" fill="#F9E79F" text-anchor="middle" font-family="sans-serif">ROYALE</text>
        <!-- Small Paint Tin Front Left -->
        <rect x="12" y="44" width="16" height="20" rx="2" fill="#FAD7A0" stroke="#D35400" stroke-width="1.2"/>
        <ellipse cx="20" cy="44" rx="8" ry="2" fill="#E67E22"/>
        <!-- Paint Roller & Brush -->
        <rect x="52" y="40" width="18" height="6" rx="2" fill="#9B59B6"/>
        <path d="M61 46 V62 H63 V46 Z" fill="#7F8C8D"/>
      </svg>
    `,
  },
  {
    id: "waterproofing",
    name: "Waterproofing",
    icon: "💧",
    productCount: 18,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Dr Fixit Yellow Jerrycan / Tub -->
        <path d="M26 22 H54 V62 H26 Z" fill="#F1C40F" stroke="#B7950B" stroke-width="1.5" rx="3"/>
        <rect x="33" y="16" width="14" height="6" rx="2" fill="#2C3E50"/>
        <!-- Handle -->
        <path d="M30 22 C30 18 50 18 50 22" stroke="#B7950B" stroke-width="2.5" fill="none"/>
        <rect x="28" y="32" width="24" height="18" fill="#2980B9" rx="1"/>
        <text x="40" y="41" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="sans-serif">Dr. Fixit</text>
        <text x="40" y="47" font-size="3.5" font-weight="bold" fill="#F1C40F" text-anchor="middle" font-family="sans-serif">LW+ 101</text>
        <!-- Water droplets -->
        <path d="M16 46 C16 42 20 38 20 38 C20 38 24 42 24 46 C24 48 22 50 20 50 C18 50 16 48 16 46 Z" fill="#3498DB"/>
        <path d="M60 48 C60 45 63 42 63 42 C63 42 66 45 66 48 C66 49.5 64.5 51 63 51 C61.5 51 60 49.5 60 48 Z" fill="#5DADE2"/>
      </svg>
    `,
  },
  {
    id: "plywood",
    name: "Plywood, MDF & HDHMR",
    icon: "🪵",
    productCount: 22,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Stacked Plywood Board 1 (Back) -->
        <rect x="20" y="15" width="44" height="50" rx="2" fill="#D35400" stroke="#A04000" stroke-width="1.2"/>
        <text x="42" y="24" font-size="5" font-weight="bold" fill="#FAD7A0" text-anchor="middle">CENTURY 710</text>
        <!-- Stacked Plywood Board 2 (Mid - Birch) -->
        <rect x="14" y="23" width="44" height="46" rx="2" fill="#EDBB99" stroke="#BA4A00" stroke-width="1.2"/>
        <text x="36" y="32" font-size="4.5" font-weight="bold" fill="#6E2C00" text-anchor="middle">GREENPLY</text>
        <!-- Front HDHMR Charcoal Board -->
        <rect x="22" y="36" width="42" height="30" rx="2" fill="#566573" stroke="#2C3E50" stroke-width="1.5"/>
        <rect x="25" y="40" width="36" height="8" fill="#1C2833" rx="1"/>
        <text x="43" y="46" font-size="5" font-weight="900" fill="#F4D03F" text-anchor="middle">TESA HDHMR</text>
        <text x="43" y="58" font-size="3.5" font-weight="bold" fill="#E5E8E8" text-anchor="middle">18mm WATERPROOF</text>
      </svg>
    `,
  },
  {
    id: "fevicol",
    name: "Fevicol",
    icon: "🧴",
    productCount: 8,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Main Fevicol SH Bucket -->
        <path d="M25 28 L28 62 H52 L55 28 Z" fill="#FDFEFE" stroke="#2980B9" stroke-width="1.5"/>
        <ellipse cx="40" cy="28" rx="15" ry="4" fill="#2980B9"/>
        <rect x="28" y="36" width="24" height="15" fill="#F4D03F" rx="1"/>
        <text x="40" y="45" font-size="5.5" font-weight="900" fill="#1B4F72" text-anchor="middle" font-family="sans-serif">FEVICOL</text>
        <text x="40" y="50" font-size="4" font-weight="bold" fill="#C0392B" text-anchor="middle" font-family="sans-serif">SH</text>
        <!-- Small Blue Marine Tub Right -->
        <rect x="50" y="42" width="16" height="20" rx="2" fill="#2471A3" stroke="#1A5276" stroke-width="1"/>
        <text x="58" y="54" font-size="3.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">MARINE</text>
        <!-- Adhesive Squeeze Tube Left -->
        <path d="M15 36 L22 40 V60 L15 56 Z" fill="#E67E22" stroke="#BA4A00" stroke-width="1"/>
      </svg>
    `,
  },
  {
    id: "hardware",
    name: "General Hardware & Tools",
    icon: "🔩",
    productCount: 15,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Aluminum Step Ladder -->
        <path d="M22 64 L34 18 H38 L50 64" stroke="#7F8C8D" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="26" y1="52" x2="46" y2="52" stroke="#BDC3C7" stroke-width="2"/>
        <line x1="29" y1="40" x2="43" y2="40" stroke="#BDC3C7" stroke-width="2"/>
        <line x1="32" y1="28" x2="40" y2="28" stroke="#BDC3C7" stroke-width="2"/>
        <!-- Hammer & Spanner foreground -->
        <path d="M52 28 L62 18 L66 22 L56 32 Z" fill="#E74C3C"/>
        <rect x="53" y="31" width="4" height="28" rx="1" fill="#784212" transform="rotate(-40 53 31)"/>
        <!-- Screw / Bolt -->
        <path d="M12 48 H20 L16 56 Z" fill="#95A5A6"/>
      </svg>
    `,
  },
  {
    id: "fans",
    name: "Ceiling Fans & Exhaust",
    icon: "🌀",
    productCount: 6,
    group: "Civil & Interiors",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Central Motor -->
        <circle cx="40" cy="40" r="9" fill="#5D4037" stroke="#3E2723" stroke-width="2"/>
        <circle cx="40" cy="40" r="4" fill="#D7CCC8"/>
        <!-- Blade 1 (Top) -->
        <path d="M37 31 L35 12 C35 10 45 10 45 12 L43 31 Z" fill="#6D4C41" stroke="#3E2723" stroke-width="1.2"/>
        <!-- Blade 2 (Bottom Right) -->
        <path d="M47 45 L64 56 C66 58 60 66 58 64 L42 48 Z" fill="#6D4C41" stroke="#3E2723" stroke-width="1.2"/>
        <!-- Blade 3 (Bottom Left) -->
        <path d="M33 45 L16 56 C14 58 20 66 22 64 L38 48 Z" fill="#6D4C41" stroke="#3E2723" stroke-width="1.2"/>
        <!-- Breeze ripples -->
        <path d="M60 26 C64 30 64 36 60 40" stroke="#81D4FA" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `,
  },

  // -------------------------------------------------------------
  // Furniture & Architectural Hardware
  // -------------------------------------------------------------
  {
    id: "hinges",
    name: "Hinges, Channels & Handles",
    icon: "📐",
    productCount: 14,
    group: "Furniture & Architectural Hardware",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Telescopic Drawer Channel -->
        <rect x="12" y="20" width="56" height="8" rx="1.5" fill="#7F8C8D" stroke="#34495E" stroke-width="1.2"/>
        <rect x="18" y="22" width="46" height="4" fill="#BDC3C7"/>
        <circle cx="22" cy="24" r="1.5" fill="#2C3E50"/>
        <circle cx="38" cy="24" r="1.5" fill="#2C3E50"/>
        <circle cx="56" cy="24" r="1.5" fill="#2C3E50"/>
        <!-- Soft Close Concealed Auto Hinge -->
        <path d="M22 42 H46 L54 58 H30 Z" fill="#BDC3C7" stroke="#7F8C8D" stroke-width="1.5"/>
        <circle cx="28" cy="48" r="4" fill="#95A5A6"/>
        <rect x="42" y="52" width="22" height="8" rx="2" fill="#2C3E50"/>
        <text x="53" y="58" font-size="4" font-weight="bold" fill="#F4D03F" text-anchor="middle">Hettich</text>
      </svg>
    `,
  },
  {
    id: "kitchen",
    name: "Kitchen Systems & Accessories",
    icon: "🍳",
    productCount: 16,
    group: "Furniture & Architectural Hardware",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- SS304 Kitchen Basket / Tandem Box -->
        <rect x="14" y="26" width="52" height="34" rx="3" fill="#EAECEE" stroke="#7F8C8D" stroke-width="1.5"/>
        <line x1="22" y1="30" x2="22" y2="56" stroke="#BDC3C7" stroke-width="1.5"/>
        <line x1="30" y1="30" x2="30" y2="56" stroke="#BDC3C7" stroke-width="1.5"/>
        <line x1="38" y1="30" x2="38" y2="56" stroke="#BDC3C7" stroke-width="1.5"/>
        <line x1="46" y1="30" x2="46" y2="56" stroke="#BDC3C7" stroke-width="1.5"/>
        <line x1="54" y1="30" x2="54" y2="56" stroke="#BDC3C7" stroke-width="1.5"/>
        <rect x="12" y="24" width="56" height="5" rx="2" fill="#95A5A6"/>
        <!-- Wooden Cutlery Tray inside -->
        <rect x="22" y="16" width="36" height="12" rx="2" fill="#D35400" opacity="0.9"/>
        <line x1="34" y1="16" x2="34" y2="28" stroke="#FAD7A0" stroke-width="1"/>
      </svg>
    `,
  },
  {
    id: "wardrobe",
    name: "Wardrobe & Bed Fittings",
    icon: "🗄️",
    productCount: 12,
    group: "Furniture & Architectural Hardware",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Hydraulic Bed Lift Extended Arm -->
        <path d="M16 58 L46 22 H64" stroke="#2C3E50" stroke-width="3" stroke-linecap="round"/>
        <!-- Hydraulic Gas Pump Cylinder -->
        <rect x="34" y="38" width="24" height="6" rx="2" fill="#E67E22" stroke="#D35400" stroke-width="1" transform="rotate(-35 34 38)"/>
        <!-- Wardrobe Oval Rail & Hanger -->
        <ellipse cx="36" cy="18" rx="20" ry="3" fill="#BDC3C7" stroke="#7F8C8D" stroke-width="1.2"/>
        <path d="M28 20 L36 28 L44 20" stroke="#27AE60" stroke-width="2" fill="none"/>
        <circle cx="36" cy="15" r="2.5" stroke="#27AE60" stroke-width="1.5" fill="none"/>
      </svg>
    `,
  },
  {
    id: "locks",
    name: "Door Locks & Hardware",
    icon: "🔒",
    productCount: 10,
    group: "Furniture & Architectural Hardware",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Brass / Antique Nickel Mortise Lock Plate -->
        <rect x="30" y="16" width="20" height="48" rx="4" fill="#F39C12" stroke="#B7950B" stroke-width="1.5"/>
        <!-- Handle Lever -->
        <rect x="14" y="26" width="30" height="6" rx="3" fill="#D68910" stroke="#7E5109" stroke-width="1.2"/>
        <circle cx="40" cy="29" r="4.5" fill="#7E5109"/>
        <!-- Keyhole / Deadbolt Slot -->
        <circle cx="40" cy="46" r="3" fill="#2C3E50"/>
        <path d="M39 47 L38 54 H42 L41 47 Z" fill="#2C3E50"/>
        <!-- Brass Key Left -->
        <circle cx="18" cy="54" r="3.5" stroke="#F1C40F" stroke-width="1.5" fill="none"/>
        <line x1="21.5" y1="54" x2="30" y2="54" stroke="#F1C40F" stroke-width="1.5"/>
        <line x1="28" y1="54" x2="28" y2="57" stroke="#F1C40F" stroke-width="1.5"/>
      </svg>
    `,
  },

  // -------------------------------------------------------------
  // Electrical
  // -------------------------------------------------------------
  {
    id: "wires",
    name: "Wires, MCB & Distribution Boards",
    icon: "⚡",
    productCount: 20,
    group: "Electrical",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Coiled Red Wire (Polycab FR) -->
        <ellipse cx="36" cy="42" rx="22" ry="14" fill="#C0392B" stroke="#922B21" stroke-width="2"/>
        <ellipse cx="36" cy="42" rx="14" ry="8" fill="#F4D03F"/>
        <text x="36" y="44" font-size="3.5" font-weight="900" fill="#78281F" text-anchor="middle">POLYCAB</text>
        <!-- Blue Wire Layer Behind -->
        <ellipse cx="44" cy="34" rx="18" ry="10" stroke="#2980B9" stroke-width="4" fill="none" opacity="0.8"/>
        <!-- White MCB Breaker Front Right -->
        <rect x="46" y="36" width="18" height="30" rx="2" fill="#F8F9F9" stroke="#7F8C8D" stroke-width="1.2"/>
        <rect x="52" y="44" width="6" height="10" rx="1" fill="#E74C3C"/>
        <circle cx="55" cy="41" r="1.5" fill="#27AE60"/>
      </svg>
    `,
  },
  {
    id: "switches",
    name: "Switches & Sockets",
    icon: "🔌",
    productCount: 18,
    group: "Electrical",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Modular 4-Module Switch Plate -->
        <rect x="15" y="24" width="50" height="34" rx="4" fill="#FFFFFF" stroke="#BDC3C7" stroke-width="1.5"/>
        <rect x="18" y="27" width="44" height="28" rx="2" fill="#F4F6F6"/>
        <!-- Switch 1 -->
        <rect x="22" y="32" width="7" height="18" rx="1" fill="#FFFFFF" stroke="#95A5A6" stroke-width="1"/>
        <line x1="22" y1="41" x2="29" y2="41" stroke="#BDC3C7" stroke-width="1"/>
        <!-- Switch 2 -->
        <rect x="32" y="32" width="7" height="18" rx="1" fill="#FFFFFF" stroke="#95A5A6" stroke-width="1"/>
        <line x1="32" y1="41" x2="39" y2="41" stroke="#BDC3C7" stroke-width="1"/>
        <!-- 3-Pin Socket -->
        <rect x="42" y="32" width="16" height="18" rx="2" fill="#FFFFFF" stroke="#95A5A6" stroke-width="1"/>
        <circle cx="50" cy="37" r="1.8" fill="#2C3E50"/>
        <circle cx="46" cy="43" r="1.3" fill="#2C3E50"/>
        <circle cx="54" cy="43" r="1.3" fill="#2C3E50"/>
      </svg>
    `,
  },
  {
    id: "lighting",
    name: "Lighting",
    icon: "💡",
    productCount: 15,
    group: "Electrical",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Round Recessed Slim LED Panel -->
        <circle cx="40" cy="40" r="22" fill="#FFFFFF" stroke="#BDC3C7" stroke-width="2"/>
        <circle cx="40" cy="40" r="17" fill="#FEF9E7" stroke="#F9E79F" stroke-width="1"/>
        <!-- Warm Glow Center -->
        <circle cx="40" cy="40" r="10" fill="#FDEBD0"/>
        <!-- Side Mounting Springs -->
        <path d="M16 38 C14 34 12 36 12 42" stroke="#E67E22" stroke-width="2" stroke-linecap="round"/>
        <path d="M64 38 C66 34 68 36 68 42" stroke="#E67E22" stroke-width="2" stroke-linecap="round"/>
        <!-- Rays -->
        <line x1="40" y1="12" x2="40" y2="6" stroke="#F39C12" stroke-width="2" stroke-linecap="round"/>
        <line x1="60" y1="20" x2="65" y2="15" stroke="#F39C12" stroke-width="2" stroke-linecap="round"/>
        <line x1="20" y1="20" x2="15" y2="15" stroke="#F39C12" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
  },

  // -------------------------------------------------------------
  // Plumbing & Sanitary
  // -------------------------------------------------------------
  {
    id: "plumbing",
    name: "Plumbing",
    icon: "🚰",
    productCount: 12,
    group: "Plumbing & Sanitary",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- CPVC Pipe Network -->
        <!-- Main Pipe -->
        <rect x="14" y="36" width="52" height="8" rx="2" fill="#FAD7A0" stroke="#E67E22" stroke-width="1.5"/>
        <line x1="14" y1="40" x2="66" y2="40" stroke="#D35400" stroke-width="1" stroke-dasharray="4 2"/>
        <!-- 90 Degree Elbow -->
        <path d="M48 20 V36" stroke="#E67E22" stroke-width="8" stroke-linecap="square"/>
        <path d="M48 20 V36" stroke="#FAD7A0" stroke-width="6" stroke-linecap="square"/>
        <!-- Brass Valve Fitting -->
        <circle cx="48" cy="20" r="5" fill="#F1C40F" stroke="#B7950B" stroke-width="1.2"/>
        <rect x="42" y="14" width="12" height="3" rx="1" fill="#C0392B"/>
        <!-- Water Droplet -->
        <path d="M30 48 C30 48 34 54 34 57 C34 59.2 32.2 61 30 61 C27.8 61 26 59.2 26 57 C26 54 30 48 30 48 Z" fill="#3498DB"/>
      </svg>
    `,
  },
  {
    id: "sanitary",
    name: "Sanitary",
    icon: "🚿",
    productCount: 10,
    group: "Plumbing & Sanitary",
    svg: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-xs">
        <!-- Overhead Rain Shower Head -->
        <path d="M22 18 H48 V26" stroke="#7F8C8D" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="48" cy="28" rx="14" ry="4" fill="#BDC3C7" stroke="#7F8C8D" stroke-width="1.5"/>
        <!-- Rain Streams -->
        <line x1="40" y1="34" x2="38" y2="46" stroke="#5DADE2" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2"/>
        <line x1="48" y1="34" x2="48" y2="48" stroke="#5DADE2" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2"/>
        <line x1="56" y1="34" x2="58" y2="46" stroke="#5DADE2" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2"/>
        <!-- Chrome Health Faucet / Jet Spray -->
        <path d="M18 42 H24 V58" stroke="#95A5A6" stroke-width="2" stroke-linecap="round"/>
        <path d="M24 42 L32 38" stroke="#BDC3C7" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `,
  },
];

export const CATEGORY_GROUPS = [
  "Civil & Interiors",
  "Furniture & Architectural Hardware",
  "Electrical",
  "Plumbing & Sanitary",
] as const;
