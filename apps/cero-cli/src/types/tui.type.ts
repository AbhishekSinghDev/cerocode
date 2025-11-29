import type { SUPPORTED_AI_MODELS } from "@cerocode/constants";
import type { User } from "./user.type";

export interface Command {
  key: string;
  description: string;
  context?: "global" | "sidebar" | "chat";
}

export type FocusMode = "sidebar" | "chat";

export type SupportedAIModelId = (typeof SUPPORTED_AI_MODELS)[number]["id"];

export interface UIState {
  sidebarCollapsed: boolean;
  focusedChatIndex: number;
  inputFocused: boolean;
  selectedModel: SupportedAIModelId;
  modelSelectorOpen: boolean;
  focusMode: FocusMode;
}

export interface LayoutDimensions {
  width: number;
  height: number;
  sidebarWidth: number;
  chatWidth: number;
}

export interface ThemeContextValue {
  colors: ThemeColors;
  currentThemeId: string;
  currentThemeName: string;

  themes: ThemeDefinition[];
  themeCount: number;
  currentThemeIndex: number;

  showThemeIndicator: boolean;

  nextTheme: () => void;
  setThemeById: (id: string) => void;
}

export interface UIActions {
  toggleSidebar: () => void;
  toggleModelSelector: () => void;
  setSelectedModel: (modelId: SupportedAIModelId) => void;
  setFocusMode: (mode: FocusMode) => void;
  setInputFocused: (focused: boolean) => void;
  setFocusedChatIndex: (index: number | ((prev: number) => number)) => void;
  focusChat: () => void;
  focusSidebar: () => void;
  resetForNewChat: () => void;
}

export interface UIContextValue extends UIState, UIActions {
  layout: LayoutDimensions;
  isInputDisabled: boolean;
}

export interface ChatState {
  messages: ApiMessage[];
  messagesLoading: boolean;
  isSending: boolean;
  isStreaming: boolean;
  error: string | null;
}

export interface ActiveChat {
  conversationId: string | null;
  conversation: Conversation | null;
}

export interface ChatContextValue {
  // State
  messages: ApiMessage[];
  messagesLoading: boolean;
  isSending: boolean;
  isStreaming: boolean;
  error: string | null;

  // Active chat info
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  chatTitle: string;
  isNewChat: boolean;
  isLoading: boolean;

  // Actions
  openChat: (conversation: Conversation) => Promise<void>;
  startNewChat: () => void;
  sendMessage: (
    content: string,
    aiModel: SupportedAIModelId
  ) => Promise<{ conversationId: string | null }>;
  clearError: () => void;
}

export interface ConversationsState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

export interface ConversationsContextValue {
  // State
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
  getConversation: (id: string) => Conversation | undefined;
}

export interface Conversation {
  createdAt: Date;
  updatedAt: Date;
  id: string;
  userId: string;
  shortTitle: string | null;
}

export interface ApiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface MessagesResponse {
  conversation: Conversation;
  messages: ApiMessage[];
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState, AuthActions {}

export interface AuthActions {
  getToken: () => Promise<string | null>;
  refresh: () => Promise<void>;
}

export interface ConversationState {
  // Conversations list
  conversations: Conversation[];
  conversationsLoading: boolean;
  conversationsError: string | null;

  // Current chat
  messages: ApiMessage[];
  currentConversationId: string | null;
  messagesLoading: boolean;

  // Chat operations state
  isSending: boolean;
  isStreaming: boolean;
  chatError: string | null;
}

export interface ConversationActions {
  selectConversation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  startNewChat: () => void;
  refreshConversations: () => Promise<void>;
}

export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryMuted: string;
  secondary: string;
  secondaryMuted: string;
  accent: string;
  accentMuted: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Background colors (dark to light)
  bg1: string; // Darkest - main background
  bg2: string; // Slightly lighter - secondary areas
  bg3: string; // Panels, inputs
  bg4: string; // Elevated surfaces, cards
  bg5: string; // Highest elevation

  // Foreground/Text colors (light to dark)
  fg1: string; // Brightest - primary text
  fg2: string; // Secondary text
  fg3: string; // Muted text
  fg4: string; // Subtle/hint text
  fg5: string; // Disabled/placeholder

  // Border colors
  border1: string; // Default border
  border2: string; // Subtle border
  border3: string; // Focused/highlighted border
}

/**
 * Extended syntax colors for code/markdown highlighting
 * Derived from ThemeColors - used by syntax.ts
 * Matches OpenCode's full theme color set
 */
export interface SyntaxColors {
  // Markdown colors
  markdownText: string;
  markdownHeading: string;
  markdownStrong: string;
  markdownEmph: string;
  markdownCode: string;
  markdownCodeBlock: string;
  markdownLink: string;
  markdownLinkText: string;
  markdownBlockQuote: string;
  markdownListItem: string;
  markdownListEnumeration: string;
  markdownHorizontalRule: string;
  markdownImage: string;
  markdownImageText: string;

  // Diff colors (full set from OpenCode)
  diffAdded: string;
  diffRemoved: string;
  diffContext: string;
  diffHunkHeader: string;
  diffHighlightAdded: string;
  diffHighlightRemoved: string;
  diffAddedBg: string;
  diffRemovedBg: string;
  diffContextBg: string;
  diffLineNumber: string;
  diffAddedLineNumberBg: string;
  diffRemovedLineNumberBg: string;

  // Syntax highlighting colors
  syntaxKeyword: string;
  syntaxFunction: string;
  syntaxVariable: string;
  syntaxString: string;
  syntaxNumber: string;
  syntaxType: string;
  syntaxOperator: string;
  syntaxComment: string;
  syntaxPunctuation: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  colors: ThemeColors;
}
