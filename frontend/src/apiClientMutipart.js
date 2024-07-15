import axios from 'axios';
import Cookies from 'js-cookie';

// Function to handle multipart/form-data requests
const apiClientMultipart = axios.create({
    // baseURL: "http://localhost:5000/api/v1",
    baseURL: "https://videofusionwebo-backend.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

apiClientMultipart.interceptors.request.use(
    (config) => {
        const token = Cookies.get("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Export both clients
export default apiClientMultipart;
