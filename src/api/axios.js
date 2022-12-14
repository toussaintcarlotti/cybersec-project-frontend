import axios from 'axios'
import store from '../store/index'

const instance = axios.create({
    //baseURL: 'https://api.cyber-sec-project.carlotti-toussaint.com',
    baseURL: 'http://localhost:8081',
    withCredentials: true
});


instance.interceptors.request.use(
    config => {
        if(store.getters.userToken) {
            config.headers['Authorization'] = store.getters.userToken;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    },
);

instance.interceptors.response.use(function (response) {

    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401){
        store.commit('unauthenticateUser')
        window.location.reload();
    }
    return Promise.reject(error);
});



export default instance;