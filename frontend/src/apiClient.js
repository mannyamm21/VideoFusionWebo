import axios from 'axios';

// Retrieve the token from local storage or a context/state management solution

const apiClient = axios.create({
    // baseURL: "http://localhost:5000/api/v1",
    baseURL: "https://videofusionwebo-backend.onrender.com/api/v1",
    withCredentials: true, // This ensures cookies are sent with requests
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
