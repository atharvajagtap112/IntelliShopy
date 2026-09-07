import axios from "axios"
import { toast } from "react-toastify"



export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://intellishope.onrender.com"

// WebSocket base: same host as API_BASE_URL, http->ws / https->wss, no trailing slash.
// Local: REACT_APP_API_BASE_URL=http://localhost:3333 -> ws://localhost:3333 (through the gateway)
// Prod:  falls back to wss://intellishope.onrender.com
export const WS_BASE_URL = API_BASE_URL.replace(/\/$/, "").replace(/^http/, "ws")

// OAuth login is a full-page redirect to Spring Security's /oauth2/** endpoint on the
// auth backend. The gateway can't cleanly proxy the Google handshake (redirect_uri host),
// so this points straight at the backend. Prod: unset -> falls back to API_BASE_URL.
export const OAUTH_BASE_URL = process.env.REACT_APP_OAUTH_BASE_URL || API_BASE_URL
// export const API_BASE_URL ="http://localhost:5454"

// export const API_BASE_URL ="http://localhost:5454"

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})


api.interceptors.request.use(
    (config) => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            config.headers.Authorization = `Bearer ${jwt}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auto-refresh: when the 15-min access token expires the backend returns 401.
// We catch that ONCE per request, swap the refresh token for a new access
// token, and retry the original request. The user never notices.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Gateway's token-bucket rate limiter ran out for this client.
        if (error.response?.status === 429) {
            toast.error("Too many requests — please slow down and try again shortly.");
            return Promise.reject(error);
        }

        // Only try to refresh on a 401, and only once (the _retry flag stops
        // an infinite loop if the refresh itself also fails).
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return Promise.reject(error);

            try {
                // Use raw axios (NOT api) so this call skips these interceptors.
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });
                localStorage.setItem("jwt", data.jwt);
                originalRequest.headers.Authorization = `Bearer ${data.jwt}`;
                return api(originalRequest); // replay the request that got 401'd
            } catch (refreshError) {
                // Refresh token dead/expired -> force a clean logout.
                localStorage.removeItem("jwt");
                localStorage.removeItem("refreshToken");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
 
