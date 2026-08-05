import axios from 'axios';

const apiOrigin = import.meta.env.VITE_API_ORIGIN;

if(!apiOrigin){
    throw new Error(
        'VITE_API_ORIGIN is not configured.'
    )
}

export const http = axios.create({
    baseURL: apiOrigin,

    withCredentials: true,

    withXSRFToken: true,

    headers: {
        Accept: 'application/json',
    },
});

export async function initializeCrsf(){
    await http.get('/sanctum/csrf-cookie');
}

export default http;