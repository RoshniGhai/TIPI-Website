const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000/api/v1';
const TOKEN_KEY = 'tipi_cms_token';

export function getCmsToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setCmsToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearCmsToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function cmsRequest(path, options = {}) {
  const token = getCmsToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `CMS request failed: ${response.status}`);
  }

  return response.json();
}

export async function cmsLogin(payload) {
  const result = await cmsRequest('/cms/login/', {
    body: JSON.stringify(payload),
    method: 'POST',
  });
  setCmsToken(result.token);
  return result.user;
}

export const cmsMe = () => cmsRequest('/cms/me/');
export const cmsConfig = () => cmsRequest('/cms/config/');
export const cmsDashboard = () => cmsRequest('/cms/dashboard/');
export const cmsLookups = () => cmsRequest('/cms/lookups/');
export const cmsInsights = () => cmsRequest('/cms/insights/');
export const cmsEvents = () => cmsRequest('/cms/events/');
export const cmsBanners = () => cmsRequest('/cms/banners/');
export const cmsUsers = () => cmsRequest('/cms/users/');
export const cmsCategories = () => cmsRequest('/cms/categories/');
export const cmsAuthors = () => cmsRequest('/cms/authors/');
export const cmsSpeakers = () => cmsRequest('/cms/speakers/');

export function createCmsInsight(payload) {
  return cmsRequest('/cms/insights/', { body: JSON.stringify(payload), method: 'POST' });
}

export function updateCmsInsight(id, payload) {
  return cmsRequest(`/cms/insights/${id}/`, { body: JSON.stringify(payload), method: 'PATCH' });
}

export function runInsightAction(id, action) {
  return cmsRequest(`/cms/insights/${id}/${action}/`, { method: 'POST' });
}

export function createCmsEvent(payload) {
  return cmsRequest('/cms/events/', { body: JSON.stringify(payload), method: 'POST' });
}

export function runEventAction(id, action) {
  return cmsRequest(`/cms/events/${id}/${action}/`, { method: 'POST' });
}

export function createCmsUser(payload) {
  return cmsRequest('/cms/users/', { body: JSON.stringify(payload), method: 'POST' });
}

export function createCmsCategory(payload) {
  return cmsRequest('/cms/categories/', { body: JSON.stringify(payload), method: 'POST' });
}

export function createCmsAuthor(payload) {
  return cmsRequest('/cms/authors/', { body: JSON.stringify(payload), method: 'POST' });
}

export function createCmsSpeaker(payload) {
  return cmsRequest('/cms/speakers/', { body: JSON.stringify(payload), method: 'POST' });
}
