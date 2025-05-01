import { Login, LoginResponse } from "@/lib/types/Login"

export const login = async ({ identity, password }: Login): Promise<LoginResponse | null> => {
    try {
        const res = await fetch(`https://schoolapi.theripplebytes.com/api/v1/publics/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identity,
                password
            })
        })

        if (!res.ok) {
            return {
                data: { user: null }, // Default valid data structure
                message: "Invalid login credentials"
            }
        }

        return res.json()
    } catch {
        return {
            data: { user: null }, // Default valid data structure
            message: "An unexpected error occurred"
        }
    }
}