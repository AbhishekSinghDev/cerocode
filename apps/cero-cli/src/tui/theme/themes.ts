// =============================================
// THEME 1: Matrix (Original)
// =============================================

import type { ThemeColors, ThemeDefinition } from "types/tui.type";

const matrixColors: ThemeColors = {
  primary: "#00ff41",
  primaryMuted: "#5eb88d",
  secondary: "#00d4ff",
  secondaryMuted: "#4ab8d6",
  accent: "#a855f7",
  accentMuted: "#8b5cc4",
  success: "#00ff41",
  warning: "#ffb700",
  error: "#ff3366",
  info: "#00d4ff",
  bg1: "#0a0a0e",
  bg2: "#0f0f14",
  bg3: "#14141b",
  bg4: "#1a1a24",
  bg5: "#1e1e2a",
  fg1: "#e8e8f0",
  fg2: "#c0c0cc",
  fg3: "#8888a0",
  fg4: "#666678",
  fg5: "#555566",
  border1: "rgba(255, 255, 255, 0.08)",
  border2: "rgba(255, 255, 255, 0.05)",
  border3: "#00ff41",
};

// =============================================
// THEME 2: Dracula
// =============================================
const draculaColors: ThemeColors = {
  primary: "#bd93f9",
  primaryMuted: "#9580c4",
  secondary: "#8be9fd",
  secondaryMuted: "#6fc4d6",
  accent: "#ff79c6",
  accentMuted: "#d465a8",
  success: "#50fa7b",
  warning: "#f1fa8c",
  error: "#ff5555",
  info: "#8be9fd",
  bg1: "#1e1f29",
  bg2: "#21222c",
  bg3: "#282a36",
  bg4: "#343746",
  bg5: "#3d4056",
  fg1: "#f8f8f2",
  fg2: "#d0d0da",
  fg3: "#a0a0b0",
  fg4: "#808090",
  fg5: "#606070",
  border1: "rgba(255, 255, 255, 0.1)",
  border2: "rgba(255, 255, 255, 0.06)",
  border3: "#bd93f9",
};

// =============================================
// THEME 3: Nord
// =============================================
const nordColors: ThemeColors = {
  primary: "#88c0d0",
  primaryMuted: "#6a9fb0",
  secondary: "#81a1c1",
  secondaryMuted: "#6888a6",
  accent: "#b48ead",
  accentMuted: "#967590",
  success: "#a3be8c",
  warning: "#ebcb8b",
  error: "#bf616a",
  info: "#81a1c1",
  bg1: "#272c36",
  bg2: "#2e3440",
  bg3: "#3b4252",
  bg4: "#434c5e",
  bg5: "#4c566a",
  fg1: "#eceff4",
  fg2: "#d8dee9",
  fg3: "#a0aab8",
  fg4: "#7a8696",
  fg5: "#5a6478",
  border1: "rgba(236, 239, 244, 0.1)",
  border2: "rgba(236, 239, 244, 0.06)",
  border3: "#88c0d0",
};

// =============================================
// THEME 4: Monokai Pro
// =============================================
const monokaiColors: ThemeColors = {
  primary: "#a9dc76",
  primaryMuted: "#8ab862",
  secondary: "#78dce8",
  secondaryMuted: "#5fb8c4",
  accent: "#ff6188",
  accentMuted: "#d4526f",
  success: "#a9dc76",
  warning: "#ffd866",
  error: "#ff6188",
  info: "#78dce8",
  bg1: "#1a181a",
  bg2: "#221f22",
  bg3: "#2d2a2e",
  bg4: "#3a373b",
  bg5: "#454045",
  fg1: "#fcfcfa",
  fg2: "#d0d0ca",
  fg3: "#939293",
  fg4: "#727072",
  fg5: "#5b595c",
  border1: "rgba(255, 255, 255, 0.1)",
  border2: "rgba(255, 255, 255, 0.06)",
  border3: "#a9dc76",
};

// =============================================
// THEME 5: Catppuccin Mocha
// =============================================
const catppuccinColors: ThemeColors = {
  primary: "#cba6f7",
  primaryMuted: "#a688d4",
  secondary: "#89dceb",
  secondaryMuted: "#6bb8c6",
  accent: "#f5c2e7",
  accentMuted: "#d0a3c4",
  success: "#a6e3a1",
  warning: "#f9e2af",
  error: "#f38ba8",
  info: "#89dceb",
  bg1: "#11111b",
  bg2: "#181825",
  bg3: "#1e1e2e",
  bg4: "#313244",
  bg5: "#45475a",
  fg1: "#cdd6f4",
  fg2: "#bac2de",
  fg3: "#9399b2",
  fg4: "#7f849c",
  fg5: "#6c7086",
  border1: "rgba(205, 214, 244, 0.1)",
  border2: "rgba(205, 214, 244, 0.06)",
  border3: "#cba6f7",
};

// =============================================
// THEME 6: Solarized Dark
// =============================================
const solarizedColors: ThemeColors = {
  primary: "#268bd2",
  primaryMuted: "#4e9bc8",
  secondary: "#2aa198",
  secondaryMuted: "#48b5ac",
  accent: "#d33682",
  accentMuted: "#b34d78",
  success: "#859900",
  warning: "#b58900",
  error: "#dc322f",
  info: "#2aa198",
  bg1: "#001f28",
  bg2: "#002b36",
  bg3: "#073642",
  bg4: "#0a4050",
  bg5: "#0d4a5c",
  fg1: "#fdf6e3",
  fg2: "#eee8d5",
  fg3: "#93a1a1",
  fg4: "#839496",
  fg5: "#657b83",
  border1: "rgba(147, 161, 161, 0.15)",
  border2: "rgba(147, 161, 161, 0.08)",
  border3: "#268bd2",
};

// =============================================
// THEME 7: Gruvbox Dark
// =============================================
const gruvboxColors: ThemeColors = {
  primary: "#fabd2f",
  primaryMuted: "#d8a626",
  secondary: "#83a598",
  secondaryMuted: "#6a8a7c",
  accent: "#d3869b",
  accentMuted: "#b36e84",
  success: "#b8bb26",
  warning: "#fe8019",
  error: "#fb4934",
  info: "#83a598",
  bg1: "#1a1a1a",
  bg2: "#1d2021",
  bg3: "#282828",
  bg4: "#3c3836",
  bg5: "#504945",
  fg1: "#ebdbb2",
  fg2: "#d5c4a1",
  fg3: "#a89984",
  fg4: "#928374",
  fg5: "#7c6f64",
  border1: "rgba(235, 219, 178, 0.12)",
  border2: "rgba(235, 219, 178, 0.06)",
  border3: "#fabd2f",
};

// =============================================
// THEME 8: Tokyo Night
// =============================================
const tokyoNightColors: ThemeColors = {
  primary: "#7aa2f7",
  primaryMuted: "#6688d4",
  secondary: "#bb9af7",
  secondaryMuted: "#9a7ed0",
  accent: "#ff9e64",
  accentMuted: "#d68450",
  success: "#9ece6a",
  warning: "#e0af68",
  error: "#f7768e",
  info: "#7dcfff",
  bg1: "#12121a",
  bg2: "#16161e",
  bg3: "#1a1b26",
  bg4: "#24283b",
  bg5: "#292e42",
  fg1: "#c0caf5",
  fg2: "#a9b1d6",
  fg3: "#787c99",
  fg4: "#565f89",
  fg5: "#444b6a",
  border1: "rgba(169, 177, 214, 0.1)",
  border2: "rgba(169, 177, 214, 0.06)",
  border3: "#7aa2f7",
};

// =============================================
// THEME 9: One Dark Pro
// =============================================
const oneDarkColors: ThemeColors = {
  primary: "#61afef",
  primaryMuted: "#5299d4",
  secondary: "#c678dd",
  secondaryMuted: "#a663ba",
  accent: "#e06c75",
  accentMuted: "#bd5a62",
  success: "#98c379",
  warning: "#e5c07b",
  error: "#e06c75",
  info: "#56b6c2",
  bg1: "#1b1d23",
  bg2: "#21252b",
  bg3: "#282c34",
  bg4: "#2c313a",
  bg5: "#3a3f4b",
  fg1: "#abb2bf",
  fg2: "#9da5b4",
  fg3: "#7f848e",
  fg4: "#636d83",
  fg5: "#4b5263",
  border1: "rgba(171, 178, 191, 0.12)",
  border2: "rgba(171, 178, 191, 0.06)",
  border3: "#61afef",
};

// =============================================
// THEME 10: Cyberpunk
// =============================================
const cyberpunkColors: ThemeColors = {
  primary: "#ff00ff",
  primaryMuted: "#cc44cc",
  secondary: "#00ffff",
  secondaryMuted: "#44cccc",
  accent: "#ffff00",
  accentMuted: "#cccc44",
  success: "#00ff00",
  warning: "#ff6600",
  error: "#ff0044",
  info: "#00ffff",
  bg1: "#04040a",
  bg2: "#06060c",
  bg3: "#0a0a12",
  bg4: "#12121e",
  bg5: "#1a1a28",
  fg1: "#eeeeff",
  fg2: "#ccccdd",
  fg3: "#9999aa",
  fg4: "#777788",
  fg5: "#555566",
  border1: "rgba(255, 0, 255, 0.2)",
  border2: "rgba(255, 0, 255, 0.1)",
  border3: "#ff00ff",
};

// =============================================
// THEME 11: Ayu Dark
// =============================================
const ayuDarkColors: ThemeColors = {
  primary: "#59c2ff",
  primaryMuted: "#4db8e8",
  secondary: "#95e1ff",
  secondaryMuted: "#6fc4d6",
  accent: "#f29668",
  accentMuted: "#d68050",
  success: "#a6cc70",
  warning: "#ffd580",
  error: "#f07178",
  info: "#59c2ff",
  bg1: "#0f1419",
  bg2: "#151a1e",
  bg3: "#1a1f26",
  bg4: "#232833",
  bg5: "#2e323c",
  fg1: "#e6e1cf",
  fg2: "#c7c0b4",
  fg3: "#8a8680",
  fg4: "#6f6b66",
  fg5: "#54504a",
  border1: "rgba(89, 194, 255, 0.12)",
  border2: "rgba(89, 194, 255, 0.06)",
  border3: "#59c2ff",
};

// =============================================
// THEME 12: Palenight
// =============================================
const palenightColors: ThemeColors = {
  primary: "#82b1ff",
  primaryMuted: "#6f9fd8",
  secondary: "#89ddff",
  secondaryMuted: "#6bc4d6",
  accent: "#f07178",
  accentMuted: "#d4565e",
  success: "#c3e88d",
  warning: "#ffcb8b",
  error: "#f07178",
  info: "#89ddff",
  bg1: "#292d3e",
  bg2: "#2f333d",
  bg3: "#373e47",
  bg4: "#3f4451",
  bg5: "#47525b",
  fg1: "#eeffff",
  fg2: "#cfd8dc",
  fg3: "#9ccc65",
  fg4: "#80deea",
  fg5: "#546e7a",
  border1: "rgba(130, 177, 255, 0.12)",
  border2: "rgba(130, 177, 255, 0.06)",
  border3: "#82b1ff",
};

// =============================================
// THEME 13: Synthwave
// =============================================
const synthwaveColors: ThemeColors = {
  primary: "#ff006e",
  primaryMuted: "#cc0058",
  secondary: "#00f5ff",
  secondaryMuted: "#00ccc4",
  accent: "#ffbe0b",
  accentMuted: "#ccaa09",
  success: "#00f92f",
  warning: "#ffd60a",
  error: "#ff006e",
  info: "#00f5ff",
  bg1: "#0f0f1e",
  bg2: "#16213e",
  bg3: "#1a1a2e",
  bg4: "#16c784",
  bg5: "#0f3460",
  fg1: "#f0f0f0",
  fg2: "#d0d0d0",
  fg3: "#a0a0a0",
  fg4: "#707070",
  fg5: "#404040",
  border1: "rgba(255, 0, 110, 0.15)",
  border2: "rgba(255, 0, 110, 0.08)",
  border3: "#ff006e",
};

// =============================================
// THEME 14: One Light
// =============================================
const oneLightColors: ThemeColors = {
  primary: "#0184bc",
  primaryMuted: "#5a8fbf",
  secondary: "#4078f2",
  secondaryMuted: "#6b99c9",
  accent: "#a626a4",
  accentMuted: "#8b5a8c",
  success: "#50a14f",
  warning: "#c18401",
  error: "#e45649",
  info: "#4078f2",
  bg1: "#fafafa",
  bg2: "#f3f3f3",
  bg3: "#ececec",
  bg4: "#e5e5e5",
  bg5: "#dedede",
  fg1: "#383a42",
  fg2: "#545454",
  fg3: "#696c77",
  fg4: "#898d96",
  fg5: "#a0a1a7",
  border1: "rgba(56, 58, 66, 0.12)",
  border2: "rgba(56, 58, 66, 0.06)",
  border3: "#0184bc",
};

// =============================================
// THEME 15: GitHub Dark
// =============================================
const githubDarkColors: ThemeColors = {
  primary: "#58a6ff",
  primaryMuted: "#4999dd",
  secondary: "#79c0ff",
  secondaryMuted: "#5db3d5",
  accent: "#ff7b72",
  accentMuted: "#d4595e",
  success: "#3fb950",
  warning: "#d29922",
  error: "#ff7b72",
  info: "#79c0ff",
  bg1: "#0d1117",
  bg2: "#161b22",
  bg3: "#21262d",
  bg4: "#30363d",
  bg5: "#484f58",
  fg1: "#c9d1d9",
  fg2: "#b1baf8",
  fg3: "#8b949e",
  fg4: "#6e7681",
  fg5: "#484f58",
  border1: "rgba(88, 166, 255, 0.12)",
  border2: "rgba(88, 166, 255, 0.06)",
  border3: "#58a6ff",
};

// =============================================
// THEME 16: Everforest
// =============================================
const everforestColors: ThemeColors = {
  primary: "#83c092",
  primaryMuted: "#6fa17f",
  secondary: "#7dbf69",
  secondaryMuted: "#6aa15c",
  accent: "#e69183",
  accentMuted: "#c97a6e",
  success: "#83c092",
  warning: "#dbbc7f",
  error: "#e68183",
  info: "#9da9a0",
  bg1: "#2b3339",
  bg2: "#323c41",
  bg3: "#3a464e",
  bg4: "#414f56",
  bg5: "#4a595f",
  fg1: "#d8d5c7",
  fg2: "#c5c0b8",
  fg3: "#9da9a0",
  fg4: "#7f8a87",
  fg5: "#646d6a",
  border1: "rgba(131, 192, 146, 0.12)",
  border2: "rgba(131, 192, 146, 0.06)",
  border3: "#83c092",
};

// =============================================
// THEME 17: Rosé Pine
// =============================================
const rosePineColors: ThemeColors = {
  primary: "#eb6f92",
  primaryMuted: "#d4597b",
  secondary: "#f6c177",
  secondaryMuted: "#d4a466",
  accent: "#ebbcba",
  accentMuted: "#d4a9a3",
  success: "#a6e3a1",
  warning: "#f6c177",
  error: "#eb6f92",
  info: "#9ccfd8",
  bg1: "#191724",
  bg2: "#1f1d2e",
  bg3: "#26233a",
  bg4: "#31748f",
  bg5: "#403d52",
  fg1: "#e0def4",
  fg2: "#c5b9d1",
  fg3: "#9893a5",
  fg4: "#6e6a86",
  fg5: "#555169",
  border1: "rgba(235, 111, 146, 0.12)",
  border2: "rgba(235, 111, 146, 0.06)",
  border3: "#eb6f92",
};

// =============================================
// THEME 18: Tokyostation
// =============================================
const tokyostationColors: ThemeColors = {
  primary: "#8ec07c",
  primaryMuted: "#7aaa68",
  secondary: "#83a598",
  secondaryMuted: "#708a7e",
  accent: "#d65d0e",
  accentMuted: "#b84b0b",
  success: "#a89984",
  warning: "#d65d0e",
  error: "#fb4934",
  info: "#689d6a",
  bg1: "#1d2021",
  bg2: "#282828",
  bg3: "#32302f",
  bg4: "#3c3836",
  bg5: "#45403d",
  fg1: "#ebdbb2",
  fg2: "#d5c4a1",
  fg3: "#bdae93",
  fg4: "#a89984",
  fg5: "#928374",
  border1: "rgba(142, 192, 124, 0.12)",
  border2: "rgba(142, 192, 124, 0.06)",
  border3: "#8ec07c",
};

// =============================================
// THEME 19: Kanagawa
// =============================================
const kanagawaColors: ThemeColors = {
  primary: "#7aa89f",
  primaryMuted: "#66937f",
  secondary: "#9cab9d",
  secondaryMuted: "#7e8f86",
  accent: "#ff9e64",
  accentMuted: "#d68050",
  success: "#98bb6c",
  warning: "#e6b450",
  error: "#e82828",
  info: "#6a9589",
  bg1: "#1f1f28",
  bg2: "#2a2a37",
  bg3: "#33333f",
  bg4: "#3d3d4a",
  bg5: "#474757",
  fg1: "#dcd7ba",
  fg2: "#c8c093",
  fg3: "#8a8980",
  fg4: "#727169",
  fg5: "#5a5a52",
  border1: "rgba(122, 168, 159, 0.12)",
  border2: "rgba(122, 168, 159, 0.06)",
  border3: "#7aa89f",
};

// =============================================
// THEME 20: Oxocarbon
// =============================================
const oxocarbonColors: ThemeColors = {
  primary: "#0f62fe",
  primaryMuted: "#0d47d8",
  secondary: "#00bcd4",
  secondaryMuted: "#0097a7",
  accent: "#42be65",
  accentMuted: "#24a148",
  success: "#42be65",
  warning: "#f1c21b",
  error: "#da1e28",
  info: "#00bcd4",
  bg1: "#161616",
  bg2: "#262626",
  bg3: "#393939",
  bg4: "#525252",
  bg5: "#6f6f6f",
  fg1: "#f4f4f4",
  fg2: "#e0e0e0",
  fg3: "#c6c6c6",
  fg4: "#a8a8a8",
  fg5: "#8d8d8d",
  border1: "rgba(15, 98, 254, 0.12)",
  border2: "rgba(15, 98, 254, 0.06)",
  border3: "#0f62fe",
};

// =============================================
// Theme definitions array
// =============================================
export const THEMES: ThemeDefinition[] = [
  { id: "matrix", name: "Matrix", colors: matrixColors },
  { id: "dracula", name: "Dracula", colors: draculaColors },
  { id: "nord", name: "Nord", colors: nordColors },
  { id: "monokai", name: "Monokai Pro", colors: monokaiColors },
  { id: "catppuccin", name: "Catppuccin", colors: catppuccinColors },
  { id: "solarized", name: "Solarized Dark", colors: solarizedColors },
  { id: "gruvbox", name: "Gruvbox", colors: gruvboxColors },
  { id: "tokyo-night", name: "Tokyo Night", colors: tokyoNightColors },
  { id: "one-dark", name: "One Dark Pro", colors: oneDarkColors },
  { id: "cyberpunk", name: "Cyberpunk", colors: cyberpunkColors },
  { id: "ayu-dark", name: "Ayu Dark", colors: ayuDarkColors },
  { id: "palenight", name: "Palenight", colors: palenightColors },
  { id: "synthwave", name: "Synthwave", colors: synthwaveColors },
  { id: "one-light", name: "One Light", colors: oneLightColors },
  { id: "github-dark", name: "GitHub Dark", colors: githubDarkColors },
  { id: "everforest", name: "Everforest", colors: everforestColors },
  { id: "rose-pine", name: "Rosé Pine", colors: rosePineColors },
  { id: "tokyostation", name: "Tokyo Station", colors: tokyostationColors },
  { id: "kanagawa", name: "Kanagawa", colors: kanagawaColors },
  { id: "oxocarbon", name: "Oxocarbon", colors: oxocarbonColors },
];

export const DEFAULT_THEME_ID = "matrix";

export function getThemeById(id: string): ThemeDefinition | undefined {
  return THEMES.find((t) => t.id === id);
}

export function getThemeIndex(id: string): number {
  return THEMES.findIndex((t) => t.id === id);
}

export function getNextThemeId(currentId: string): string {
  const currentIndex = getThemeIndex(currentId);
  const nextIndex = (currentIndex + 1) % THEMES.length;
  const nextTheme = THEMES[nextIndex];
  return nextTheme ? nextTheme.id : DEFAULT_THEME_ID;
}
