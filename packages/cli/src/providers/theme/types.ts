export type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  selection: string;
  text: string;
  textMuted: string;
  textOnSelection: string;
  border: string;
  success: string;
  error: string;
  info: string;
};

export type Theme = {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
};