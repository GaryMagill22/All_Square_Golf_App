import axios from 'axios';

axios.defaults.baseURL = 'https://allsquare.club/api';
axios.defaults.withCredentials = true;


axios.interceptors.response.use(
    response => response, // simply return the response if no error
    error => {
        if (error.response) {
            // Handle 401 Unauthorized response
            if (error.response.status === 401) {
                window.location.href = '/';
            }

            // Handle 504 Gateway Timeout response
            if (error.response.status === 504) {
                alert('The server is not responding. Please try again later.');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.log('Error', error.message);
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
