
import { userAccess } from './UserAccess';

function getUrl(endpoint: string): string {
    return `${process.env.API_BASE_URL}${endpoint}`;
}

async function get(endpoint:string) {
    const requestOptions:RequestInit = {
        method: 'GET',
        headers: authHeader(getUrl(endpoint))
    };
    const response = await fetch(getUrl(endpoint), requestOptions);
    return handleResponse(response);
}

async function post(endpoint:string, body:object) {
    const requestOptions:RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(getUrl(endpoint)) },
        // credentials: 'include',
        body: JSON.stringify(body)
    };
    const response = await fetch(getUrl(endpoint), requestOptions);
    return handleResponse(response);
}

async function put(endpoint:string, body:object) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(getUrl(endpoint)) },
        body: JSON.stringify(body)
    };
    const response = await fetch(getUrl(endpoint), requestOptions);
    return handleResponse(response);    
}


function authHeader(url:string): HeadersInit {
    const access = userAccess.accessValue;
    const isLoggedIn = access && access.token;
    if (isLoggedIn) {
        return { Authorization: `Bearer ${access.token}` };
    } else {
        return {};
    }
}

async function handleResponse(response: Response) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    if (!response.ok) {
        if ([401, 403].includes(response.status) && userAccess.accessValue) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            userAccess.logout();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}

const _module = { get, post, put };

export default _module;

