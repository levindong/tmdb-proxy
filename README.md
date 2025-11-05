# TMDB API Proxy for LevinStreaming

**Vercel serverless proxy for TMDB API access from China** 🇨🇳 → 🌍

This proxy allows ANYAPP to access TMDB API from regions where it's blocked or restricted.

---

## 🚀 **Quick Deploy to Vercel**

### Prerequisites

- [Vercel account](https://vercel.com/signup) (free)
- [Vercel CLI](https://vercel.com/cli) (optional but recommended)

### Option 1: Deploy with Vercel CLI (Recommended)

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
cd tmdb-proxy
vercel --prod
```

That's it! 🎉

You'll get a URL like: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this `tmdb-proxy` directory
3. Click "Deploy"
4. Done! 🎉

---

## 📡 **How to Use**

### Original TMDB API URL

```
https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=1&api_key=YOUR_KEY
```

### Your Proxy URL

```
https://your-project.vercel.app/api/trending/movie/week?language=en-US&page=1
```

**Note**: API key is handled server-side, so you don't need to include it in client requests!

---

## 🔧 **Configuration**

### Update API Key

Edit `api/[...path].js`:

```javascript
const TMDB_API_KEY = 'your-new-api-key-here';
```

Then redeploy:

```bash
vercel --prod
```

### Environment Variables (Alternative)

Instead of hardcoding the API key, you can use Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `TMDB_API_KEY` = `your-api-key`
3. Update `api/[...path].js`:

```javascript
const TMDB_API_KEY = process.env.TMDB_API_KEY || '554926324bc948b82ef676d5e81362ce';
```

---

## 🧪 **Testing**

### Test locally

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Start local development server
vercel dev
```

Visit: `http://localhost:3000/api/trending/movie/week?language=en-US&page=1`

### Test production

```bash
curl "https://your-project.vercel.app/api/trending/movie/week?language=en-US&page=1"
```

---

## 📊 **API Endpoints**

All TMDB v3 API endpoints are supported. Just replace:

```
https://api.themoviedb.org/3/...
```

with:

```
https://your-project.vercel.app/api/...
```

### Examples

**Trending Movies:**
```
GET /api/trending/movie/week?language=en-US&page=1
```

**Movie Details:**
```
GET /api/movie/604079?language=en-US
```

**Search Movies:**
```
GET /api/search/movie?query=avengers&language=en-US&page=1
```

**TV Show Details:**
```
GET /api/tv/12345?language=en-US
```

---

## 🔒 **Security**

### Rate Limiting

Vercel has built-in rate limiting for serverless functions:
- Free tier: 100 requests per second
- Pro tier: Higher limits

### API Key Protection

The TMDB API key is stored server-side and never exposed to clients.

### CORS

CORS is enabled for all origins (`*`). To restrict:

Edit `api/[...path].js`:

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://your-app-domain.com',
  // ...
};
```

---

## 💰 **Cost**

Vercel Free Tier includes:
- ✅ 100GB bandwidth per month
- ✅ 100 requests per second
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero configuration

**Estimated usage for LevinStreaming:**
- ~100-500 users: **FREE**
- ~1000-5000 users: **$20/month** (Pro tier)
- ~10,000+ users: Consider caching or Pro+ tier

---

## 📈 **Monitoring**

### Vercel Dashboard

Visit: https://vercel.com/dashboard

- Real-time logs
- Request analytics
- Error tracking
- Performance metrics

### Custom Logging

Logs are automatically captured. View them:

```bash
vercel logs your-project-url
```

---

## 🐛 **Troubleshooting**

### Deployment Issues

**Error: "No token found"**
```bash
vercel login
```

**Error: "Build failed"**
```bash
# Check Node.js version
node --version  # Should be >= 18.x
```

### Runtime Issues

**TMDB API errors:**
- Check API key is valid
- Check TMDB API status: https://www.themoviedb.org/
- View Vercel logs for details

**CORS errors:**
- Check `vercel.json` CORS headers
- Ensure client is using correct URL

---

## 🔄 **Updating**

After making changes:

```bash
cd tmdb-proxy
vercel --prod
```

Vercel automatically:
- ✅ Builds your function
- ✅ Deploys globally
- ✅ Updates your URL (no downtime)

---

## 📚 **Resources**

- [Vercel Documentation](https://vercel.com/docs)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

---

## 📝 **License**

MIT License - Feel free to use and modify!

---

## 💬 **Support**

Issues? Questions?
- Check Vercel logs
- Review TMDB API docs
- Test with curl/Postman first

---

**Built with ❤️ for LevinStreaming**

🎬 **Enjoy unlimited TMDB access!** 🚀

