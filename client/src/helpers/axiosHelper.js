import axios from 'axios';


// Deployment/Production using environment variables
const apiURL = process.env.REACT_APP_API_URL;
console.log('axios helper - apiURL:', apiURL );

// Ensure we don't append '/api' if it's already present at the end of the apiURL
axios.defaults.baseURL = apiURL.endsWith('/api') ? apiURL : `${apiURL}/api`;
console.log('axios helper - baseURL:', axios.defaults.baseURL);
axios.defaults.withCredentials = true;


axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// export axios instance
export const Axios = async ({ url, method, body, headers }) => {
    const res = await axios({
        method: method,
        url: url,
        data: body,
        headers: headers,
    });
    return res.data;
}