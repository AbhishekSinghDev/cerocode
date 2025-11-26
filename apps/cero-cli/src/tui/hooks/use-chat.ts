import { AuthService } from "@core/auth/auth.service"
import { ChatService } from "@core/chat/chat.service"
import { useCallback, useEffect, useRef, useState } from "react"

import type { Message } from "../../types/tui.type"

interface UseChatOptions {
    onError?: (error: string) => void
}

interface UseChatReturn {
    messages: Message[]
    isLoading: boolean
    isStreaming: boolean
    error: string | null
    isAuthenticated: boolean
    authChecked: boolean
    sendMessage: (content: string) => Promise<void>
    clearMessages: () => void
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authChecked, setAuthChecked] = useState(false)

    const chatServiceRef = useRef<ChatService | null>(null)
    const authServiceRef = useRef<AuthService | null>(null)
    const authTokenRef = useRef<string | null>(null)

    // Initialize services
    useEffect(() => {
        chatServiceRef.current = new ChatService()
        authServiceRef.current = new AuthService()

        // Check authentication status
        const checkAuth = async () => {
            try {
                const authService = authServiceRef.current
                if (!authService) return

                const authenticated = await authService.isAuthenticated()
                setIsAuthenticated(authenticated)

                if (authenticated) {
                    const tokens = await authService.getTokens()
                    authTokenRef.current = tokens?.access_token ?? null
                }
            } catch (_err) {
                setIsAuthenticated(false)
            } finally {
                setAuthChecked(true)
            }
        }

        checkAuth()
    }, [])

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim()) return

            const chatService = chatServiceRef.current
            const authToken = authTokenRef.current

            if (!chatService) {
                setError("Chat service not initialized")
                options.onError?.("Chat service not initialized")
                return
            }

            if (!authToken) {
                setError("Not authenticated. Please run 'cero login' first.")
                options.onError?.("Not authenticated")
                return
            }

            // Clear any previous error
            setError(null)

            // Add user message
            const userMessage: Message = {
                id: `msg_${Date.now()}_user`,
                role: "user",
                content,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
            setMessages((prev) => [...prev, userMessage])

            // Don't add assistant message yet - wait for first token
            const assistantMessageId = `msg_${Date.now()}_assistant`
            const assistantTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

            setIsLoading(true)
            setIsStreaming(false)

            let hasReceivedToken = false

            try {
                await chatService.run(content, authToken, (token) => {
                    // First token received - add assistant message and switch to streaming
                    if (!hasReceivedToken) {
                        hasReceivedToken = true
                        setIsLoading(false)
                        setIsStreaming(true)

                        // Add the assistant message with the first token
                        const assistantMessage: Message = {
                            id: assistantMessageId,
                            role: "assistant",
                            content: token,
                            timestamp: assistantTimestamp,
                        }
                        setMessages((prev) => [...prev, assistantMessage])
                    } else {
                        // Append subsequent tokens to the assistant message
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMessageId ? { ...msg, content: msg.content + token } : msg
                            )
                        )
                    }
                })

                setIsStreaming(false)
            } catch (err) {
                setIsLoading(false)
                setIsStreaming(false)

                const errorMessage = err instanceof Error ? err.message : "Failed to send message"
                setError(errorMessage)
                options.onError?.(errorMessage)

                // If we haven't received any tokens, add an error message
                if (!hasReceivedToken) {
                    const errorAssistantMessage: Message = {
                        id: assistantMessageId,
                        role: "assistant",
                        content: `Error: ${errorMessage}`,
                        timestamp: assistantTimestamp,
                    }
                    setMessages((prev) => [...prev, errorAssistantMessage])
                } else {
                    // Update the existing assistant message with error
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMessageId
                                ? { ...msg, content: msg.content + `\n\nError: ${errorMessage}` }
                                : msg
                        )
                    )
                }
            }
        },
        [options]
    )

    const clearMessages = useCallback(() => {
        setMessages([])
        setError(null)
    }, [])

    return {
        messages,
        isLoading,
        isStreaming,
        error,
        isAuthenticated,
        authChecked,
        sendMessage,
        clearMessages,
        setMessages,
    }
}
