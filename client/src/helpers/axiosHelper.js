import axios from 'axios';

// Deployment
axios.defaults.baseURL = 'https://allsquare.club/api';
// Local
axios.defaults.baseURL = 'http://localhost:8000/api';


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