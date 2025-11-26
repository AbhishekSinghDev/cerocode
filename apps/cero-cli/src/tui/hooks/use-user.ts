import { AuthService } from "@core/auth/auth.service"
import { UserService } from "@core/user/user.service"
import { useEffect, useRef, useState } from "react"

import type { User } from "../../types/user.type"

interface UseUserOptions {
    onError?: (error: string) => void
}

interface UseUserReturn {
    user: User | null
    isLoading: boolean
    error: string | null
    isAuthenticated: boolean
    refetch: () => Promise<void>
}

export function useUser(options: UseUserOptions = {}): UseUserReturn {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const userServiceRef = useRef<UserService | null>(null)
    const authServiceRef = useRef<AuthService | null>(null)

    const fetchUser = async () => {
        const userService = userServiceRef.current
        const authService = authServiceRef.current

        if (!userService || !authService) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const authenticated = await authService.isAuthenticated()
            setIsAuthenticated(authenticated)

            if (!authenticated) {
                setUser(null)
                setIsLoading(false)
                return
            }

            const userData = await userService.whoAmI()
            setUser(userData)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch user"
            setError(errorMessage)
            options.onError?.(errorMessage)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Initialize services and fetch user
    useEffect(() => {
        userServiceRef.current = new UserService()
        authServiceRef.current = new AuthService()

        fetchUser()
    }, [])

    const refetch = async () => {
        await fetchUser()
    }

    return {
        user,
        isLoading,
        error,
        isAuthenticated,
        refetch,
    }
}
