/**
 * TMDB API Proxy for Vercel
 * 
 * This serverless function proxies requests to TMDB API,
 * allowing access from regions where TMDB is blocked.
 * 
 * Usage:
 * https://your-app.vercel.app/api/trending/movie/week?language=en-US&page=1
 * 
 * This will proxy to:
 * https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=1&api_key=YOUR_KEY
 */

const TMDB_API_KEY = '554926324bc948b82ef676d5e81362ce';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// CORS headers for all responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

/**
 * Main handler function
 */
export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }
  
  try {
    // Construct TMDB API path
    const tmdbPath = Array.isArray(path) ? path.join('/') : (path || '');
    
    if (!tmdbPath) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'API path is required',
        example: '/api/trending/movie/week'
      });
    }
    
    // Build full URL
    const url = `${TMDB_BASE_URL}/${tmdbPath}`;
    
    // Add API key to query parameters
    const params = new URLSearchParams({
      ...queryParams,
      api_key: TMDB_API_KEY
    });
    
    const fullUrl = `${url}?${params.toString()}`;
    
    console.log(`[Proxy] ${req.method} ${fullUrl}`);
    
    // Fetch from TMDB
    const startTime = Date.now();
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LevinStreaming/1.0'
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`[Proxy] Response ${response.status} in ${duration}ms`);
    
    // Get response data
    const data = await response.json();
    
    // Forward TMDB response
    if (!response.ok) {
      return res
        .status(response.status)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json({
          error: 'TMDB API error',
          status: response.status,
          message: data.status_message || 'Unknown error',
          tmdb_error: data
        });
    }
    
    // Success - return data with CORS headers
    return res
      .status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
      .json(data);
    
  } catch (error) {
    console.error('[Proxy] Error:', error);
    
    return res
      .status(500)
      .setHeader('Access-Control-Allow-Origin', '*')
      .json({
        error: 'Proxy error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
  }
}

