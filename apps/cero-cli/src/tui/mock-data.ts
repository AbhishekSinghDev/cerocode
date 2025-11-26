import type { AIModel, ChatSession, Message } from "../types/tui.type"

export const mockModels: AIModel[] = [
    { id: "gpt-4o", name: "GPT-4o", description: "Most capable", provider: "OpenAI" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast & efficient", provider: "OpenAI" },
    { id: "claude-4-sonnet", name: "Claude 4 Sonnet", description: "Balanced", provider: "Anthropic" },
    { id: "claude-4-opus", name: "Claude 4 Opus", description: "Most intelligent", provider: "Anthropic" },
    { id: "gemini-3", name: "Gemini 3", description: "Multimodal", provider: "Google" },
]

export const mockChatHistory: ChatSession[] = [
    { id: "1", title: "React Hooks Help", lastMessage: "Thanks for the explanation!", timestamp: "2m" },
    { id: "2", title: "TypeScript Generics", lastMessage: "That makes sense now", timestamp: "1h" },
    { id: "3", title: "API Design Patterns", lastMessage: "I'll implement that", timestamp: "3h" },
    { id: "4", title: "Docker Setup", lastMessage: "Container running!", timestamp: "1d" },
    { id: "5", title: "Git Branching", lastMessage: "Perfect workflow", timestamp: "2d" },
    { id: "6", title: "DB Optimization", lastMessage: "Much faster now", timestamp: "3d" },
    { id: "7", title: "CSS Flexbox", lastMessage: "Centered!", timestamp: "1w" },
]

export const mockMessages: Message[] = [
    { id: "m1", role: "user", content: "Can you help me understand React hooks?", timestamp: "10:30" },
    {
        id: "m2",
        role: "assistant",
        content:
            "Of course! React hooks are functions that let you use state and other React features in functional components.\n\nThe most common hooks:\n• useState - Manage local state\n• useEffect - Side effects & lifecycle\n• useContext - Access context values\n• useCallback - Memoize callbacks\n• useMemo - Memoize values",
        timestamp: "10:30",
    },
    { id: "m3", role: "user", content: "What's the difference between useCallback and useMemo?", timestamp: "10:31" },
    {
        id: "m4",
        role: "assistant",
        content:
            "Great question!\n\n• useCallback → Returns memoized function\n• useMemo → Returns memoized value\n\nBoth optimize performance by avoiding recalculations.",
        timestamp: "10:31",
    },
    { id: "m5", role: "user", content: "Thanks for the explanation!", timestamp: "10:32" },
]

export const getMessagesForChat = (chatId: string): Message[] => {
    // In real app, i am gonna fetch the messages from backend based on chatId
    if (chatId === "1") return mockMessages
    return [
        {
            id: "m1",
            role: "assistant",
            content: `This is the start of your "${mockChatHistory.find((c) => c.id === chatId)?.title}" conversation.`,
            timestamp: "—",
        },
    ]
}
