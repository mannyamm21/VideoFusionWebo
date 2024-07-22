import axios from 'axios';

// Retrieve the token from local storage or a context/state management solution

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

export default apiClientMultipart;
