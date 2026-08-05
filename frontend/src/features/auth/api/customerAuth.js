import {http, initializeCrsf} from "../../../lib/http.js";
import {parseApiError} from "../../../lib/apiError.js";

async function executeApiRequest(callback){
    try{
        return await callback();
    }catch(e){
        throw parseApiError(e);
    }
}

export async function requestCustomerCode({mobile, fullName}){
    return executeApiRequest(async () =>{
        await initializeCrsf();

        const payload = {mobile};

        if (typeof fullName === 'string' && fullName.trim() !== '') {
            payload.fullName = fullName.trim();
        }

        const response = await http.post('api/v1/auth/customer/request-code', payload);

        return response.data;
    });
}

export async function verifyCustomerCode({challengeId, code}) {
    return executeApiRequest(async () =>{
        await initializeCrsf();

        const response = await http.post('api/v1/auth/customer/verify-code', { challengeId, code });

        return response.data;
    });
}

export async function getCurrentCustomer() {
    return executeApiRequest(async () => {
        const response = await http.get('/api/v1/auth/me',);

        return response.data;
    });
}

export async function logoutCustomer() {
    return executeApiRequest(async () => {
        await initializeCrsf();

        const response = await http.post('/api/v1/auth/logout',);

        return response.data;
    });
}