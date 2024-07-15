import axios from 'axios';

// Retrieve the token from local storage or a context/state management solution
const token = localStorage.getItem('access_token') || '';
console.log("Retrieved Token:", token);


// Function to handle multipart/form-data requests
const apiClientMultipart = axios.create({
    // baseURL: "http://localhost:5000/api/v1",
    baseURL: "https://videofusionwebo-backend.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    }
});

// Export both clients
export default apiClientMultipart;
