import axios from "axios"

// export const API_BASE_URL ="https://ecommerce-backend-5vxu.onrender.com"

export const API_BASE_URL ="https://intellishope.onrender.com"
// export const API_BASE_URL ="http://localhost:5454"

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add a request interceptor to dynamically set the JWT
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
 
