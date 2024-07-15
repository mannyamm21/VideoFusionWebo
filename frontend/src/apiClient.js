import axios from 'axios';

// Retrieve the token from local storage or a context/state management solution
const token = localStorage.getItem('access_token') || '';
console.log("Retrieved Token:", token);
const apiClient = axios.create({
    // baseURL: "http://localhost:5000/api/v1",
    baseURL: "https://videofusionwebo-backend.onrender.com/api/v1",
    withCredentials: true, // This ensures cookies are sent with requests
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});


export default apiClient;