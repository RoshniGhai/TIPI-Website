import { homePageContent } from '../data/homePageContent.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

async function request(path) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}: ${path}`);
  }

  return response.json();
}

async function post(path, payload) {
  if (!API_BASE_URL) {
    return { ok: true, offline: true };
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API request failed with ${response.status}: ${message}`);
  }

  return response.json();
}

function withPublishedFallback(items) {
  return [...items].sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));
}

export async function getHomePageContent() {
  if (!API_BASE_URL) {
    return homePageContent;
  }

  return request('/homepage/');
}

export async function getInsights() {
  if (!API_BASE_URL) {
    const fromHero = homePageContent.heroSlides.map((item) => ({ ...item, tags: item.tags || ['India'] }));
    return withPublishedFallback([...homePageContent.insights, ...fromHero]);
  }

  return request('/insights/');
}

export async function getInsight(slug) {
  if (!API_BASE_URL) {
    const insights = await getInsights();
    return insights.find((insight) => insight.slug === slug || insight.id === slug) || insights[0];
  }

  return request(`/insights/${slug}/`);
}

export async function getEvents() {
  if (!API_BASE_URL) {
    return withPublishedFallback(homePageContent.events);
  }

  return request('/events/');
}

export async function getEvent(slug) {
  if (!API_BASE_URL) {
    const events = await getEvents();
    return events.find((event) => event.slug === slug || event.id === slug) || events[0];
  }

  return request(`/events/${slug}/`);
}

export async function createSubscriber(payload) {
  return post('/subscribers/', payload);
}

export async function createContactMessage(payload) {
  return post('/contact-messages/', payload);
}

export async function createInsightComment(slug, payload) {
  return post(`/insights/${slug}/comments/`, payload);
}

export async function createInsightLike(slug, payload) {
  return post(`/insights/${slug}/likes/`, payload);
}

export async function createEventRegistration(slug, payload) {
  return post(`/events/${slug}/registrations/`, payload);
}
