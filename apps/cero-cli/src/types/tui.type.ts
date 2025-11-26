
export interface ChatSession {
    id: string
    title: string
    lastMessage: string
    timestamp: string
}

export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: string
}

export interface AIModel {
    id: string
    name: string
    description: string
    provider: string
}
