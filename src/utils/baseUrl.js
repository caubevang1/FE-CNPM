import axios from "axios";
import { DOMAIN_BE, LOCALSTORAGE_USER, TOKEN } from "./constant";
import { getLocalStorage } from "./config";

export const http = axios.create({
    baseURL: DOMAIN_BE,
    timeout: 10000
});

http.interceptors.request.use(config => {
    const user = getLocalStorage(LOCALSTORAGE_USER);
    if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
});