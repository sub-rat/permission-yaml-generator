import { RoutesResponse } from "@/lib/types/Routes"
import { messages } from "../constants/messages"

export const getRoutes = async (): Promise<RoutesResponse | null> => {
    try {
        const res = await fetch(`https://schoolapi.theripplebytes.com/api/v1/me/sys/routes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json", 
            }
        })

        if (!res.ok) {
            return {
                data: [],
                message: messages.MALFORMED_AUTH
            }
        }

        return res.json()
    } catch {
        return {
            data: [],
            message: messages.GENERIC_ERROR
        }
    }
}