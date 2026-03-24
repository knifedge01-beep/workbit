import { WORKBIT_API_BASE_URL, WORKBIT_API_KEY_HEADER } from '../constants.js';
function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    };
    const bearer = process.env.WORKBIT_BEARER_TOKEN;
    if (bearer) {
        headers.Authorization = `Bearer ${bearer}`;
        return headers;
    }
    const apiKey = process.env.WORKBIT_API_KEY;
    if (apiKey) {
        headers[WORKBIT_API_KEY_HEADER] = apiKey;
    }
    return headers;
}
export async function makeWorkbitRequest(path) {
    const url = `${WORKBIT_API_BASE_URL}${path}`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Workbit API request failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
    }
    return (await response.json());
}
export async function makeWorkbitPostRequest(path, body) {
    const url = `${WORKBIT_API_BASE_URL}${path}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Workbit API request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
    }
    return (await response.json());
}
export async function makeWorkbitPatchRequest(path, body) {
    const url = `${WORKBIT_API_BASE_URL}${path}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Workbit API request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
    }
    return (await response.json());
}
