import axios  from 'axios';

export class ApiError extends Error {
    constructor({code, message, status, details ={}, requestId = null}) {
        super(message);

        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.details = details;
        this.requestId = requestId;
    }

    getFieldMessages(fieldName){
        const fields = this.details?.fields;

        if(!fields || typeof fields !== 'object' || !Array.isArray(fields[fieldName])){
            return [];
        }

        return fields[fieldName].filter(
            (message) => typeof message === 'string',
        );
    }

    getFirstFieldMessage(fieldName){
        return this.getFieldMessages(fieldName)[0];
    }
}

export function parseApiError(error){
    if(error instanceof ApiError){
        return error;
    }

    if(!axios.isAxiosError(error)){
        return new ApiError({
            code: 'UNEXPECTED_ERROR',
            message: 'An unexpected error occurred.',
            status: null,
        });
    }

    const responseData = error.response?.data;

    const responseError = responseData && typeof responseData === 'object' && responseData.error && typeof responseData.error === 'object' ? responseData.error : null;

    if(responseError){
        return new ApiError({
            code: typeof responseError.code === 'string' ? responseError.code : 'API_ERROR',
            message: typeof responseError.message === 'string' ? responseError.message : 'The request can not be completed.',
            status: error.response?.status ?? null,
            details: responseError.details && typeof responseError.details === 'object' ? responseError.details : {},
            requestId: typeof responseError.requestId === 'string' ? responseError.requestId : null,
        })
    }

    return new ApiError({
        code: 'HTTP_ERROR',
        message: 'The request could not be completed.',
        status: error.response?.status,
    })
}