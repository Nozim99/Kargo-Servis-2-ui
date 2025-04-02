import axios from "axios";
import {BASE_URL} from "./constants.ts";


const api = axios.create({
    baseURL: BASE_URL,
    timeout: 1000 * 60 * 10,
});

api.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
        return config;
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
