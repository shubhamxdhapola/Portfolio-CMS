import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const getCache = new Map();

function normalizeError(error) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    error.message = responseData?.message || error.message;
    error.status = error.response?.status;
    error.response = responseData;
  }
  return error;
}

function sendRequest(method, path, body, options) {
  const headers = { ...options.headers };
  if (body instanceof FormData) {
    Object.keys(headers)
      .filter((name) => name.toLowerCase() === 'content-type')
      .forEach((name) => delete headers[name]);
  }

  return client.request({
    ...options,
    headers,
    method,
    url: path,
    data: body,
  }).then((response) => response.data);
}

function request(method, path, body, options = {}) {
  const normalizedMethod = method.toUpperCase();

  if (normalizedMethod === 'GET') {
    const cacheKey = JSON.stringify([path, options.params || null, options.responseType || null]);
    const cachedRequest = getCache.get(cacheKey);
    if (cachedRequest) return cachedRequest;

    let pendingRequest;
    pendingRequest = sendRequest(normalizedMethod, path, body, options).catch((error) => {
      if (getCache.get(cacheKey) === pendingRequest) {
        getCache.delete(cacheKey);
      }
      throw normalizeError(error);
    });
    getCache.set(cacheKey, pendingRequest);
    return pendingRequest;
  }

  return sendRequest(normalizedMethod, path, body, options)
    .then((data) => {
      getCache.clear();
      return data;
    })
    .catch((error) => {
      throw normalizeError(error);
    });
}

export const apiClient = {
  get: (path, options) => request('GET', path, undefined, options),
  post: (path, body, options) => request('POST', path, body, options),
  put: (path, body, options) => request('PUT', path, body, options),
  patch: (path, body, options) => request('PATCH', path, body, options),
  delete: (path, options) => request('DELETE', path, undefined, options),
};
