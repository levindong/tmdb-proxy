/**
 * Simple test endpoint
 */
export default function handler(req, res) {
  res.status(200).json({
    message: 'TMDB Proxy is working!',
    timestamp: new Date().toISOString(),
    path: req.url
  });
}

