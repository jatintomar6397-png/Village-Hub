/**
 * Village Hub - Frontend Environment Configuration
 * 
 * When deploying on Vercel:
 * Set window.API_BASE_URL to your deployed Render Web Service URL:
 * e.g., window.API_BASE_URL = 'https://village-hub-api.onrender.com';
 * 
 * When running locally (or same-origin):
 * Leave window.API_BASE_URL as '' (empty string), and requests will default
 * to window.location.origin.
 */
// Live backend web service on Render (primary service: villahe-hub-api, fallback: village-hub-api)
window.API_BASE_URL = window.API_BASE_URL || 'https://villahe-hub-api.onrender.com';

