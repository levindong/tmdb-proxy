# 🔧 修复Vercel 404错误

**问题**：部署成功但访问API返回404  
**原因**：GitHub上的代码可能还是旧版本或配置有问题

---

## ✅ **解决方案：直接在GitHub编辑文件**

### **步骤1：登录GitHub**

访问：https://github.com/levindong/tmdb-proxy

---

### **步骤2：编辑 vercel.json**

1. 点击 **`vercel.json`** 文件
2. 点击右上角 **铅笔图标（Edit this file）**
3. **删除所有内容**，替换为：

```json
{
  "version": 2,
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        },
        {
          "key": "Cache-Control",
          "value": "s-maxage=3600, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

4. 点击 **Commit changes...**
5. 点击 **Commit changes** 确认

---

### **步骤3：检查 api/[...path].js 文件**

1. 进入 **`api`** 目录
2. 确认有文件：**`[...path].js`**（注意是三个点）
3. 如果文件名不对或不存在：
   - 点击 **Add file** → **Create new file**
   - 文件名输入：`[...path].js`
   - 复制下面的完整代码

**完整代码**：

```javascript
/**
 * TMDB API Proxy for Vercel
 */

const TMDB_API_KEY = '554926324bc948b82ef676d5e81362ce';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
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
        example: '/api/trending/movie/week',
        received: { path: req.query.path }
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
        message: error.message
      });
  }
}
```

4. 点击 **Commit changes**

---

### **步骤4：添加测试端点（可选）**

1. 在 **`api/`** 目录
2. 点击 **Add file** → **Create new file**
3. 文件名：`test.js`
4. 内容：

```javascript
/**
 * Simple test endpoint
 */
export default function handler(req, res) {
  res.status(200).json({
    message: 'TMDB Proxy is working!',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
}
```

5. 点击 **Commit changes**

---

## ⏰ **等待Vercel自动部署**

1. 访问：https://vercel.com/levindong-hotmailcoms-projects/tmdb-proxy
2. 查看 **Deployments**
3. 等待最新的部署完成（通常1-2分钟）
4. 状态变为 **Ready** ✅

---

## 🧪 **测试**

### **测试1：简单端点**

浏览器访问：
```
https://tmdb-proxy-livid-six.vercel.app/api/test
```

**应该返回**：
```json
{
  "message": "TMDB Proxy is working!",
  "timestamp": "2025-10-22T...",
  "path": "/api/test",
  "method": "GET"
}
```

### **测试2：TMDB代理**

浏览器访问：
```
https://tmdb-proxy-livid-six.vercel.app/api/trending/movie/week?language=en-US&page=1
```

**应该返回**：
```json
{
  "page": 1,
  "results": [
    {
      "id": 604079,
      "title": "The Long Walk",
      ...
    }
  ]
}
```

---

## 🐛 **如果还是404**

### **检查1：确认文件结构**

GitHub仓库应该是这样的：

```
tmdb-proxy/
├── api/
│   ├── [...path].js    ← 这个文件必须存在！
│   └── test.js         ← 可选
├── vercel.json
├── package.json
└── README.md
```

### **检查2：查看Vercel Build Logs**

1. 访问 Vercel Dashboard
2. 点击最新的 Deployment
3. 点击 **Build Logs**
4. 查找错误信息

### **检查3：查看Runtime Logs**

1. Vercel Dashboard → 你的项目
2. 点击 **Runtime Logs**
3. 访问一次API端点
4. 查看日志输出

---

## 🔄 **替代方案：使用CLI重新部署**

如果GitHub连接有问题，可以稍后尝试：

```bash
cd /Users/dongting/Projects/LevinStreaming/tmdb-proxy

# 方法1：直接部署（不通过GitHub）
vercel --prod

# 方法2：推送到GitHub（需要网络稳定）
git add .
git commit -m "Fix vercel.json and API routes"
git push origin main --force
```

---

## 📞 **需要帮助？**

如果完成以上步骤后仍然有问题，请提供：

1. **Vercel Build Logs**（截图或文本）
2. **Runtime Logs**（如果有）
3. **GitHub仓库的文件列表**（确认文件结构）
4. **浏览器访问的完整URL**
5. **返回的完整错误信息**

---

## 💡 **为什么会404？**

**常见原因**：

1. ❌ **文件名不对**
   - 必须是 `[...path].js`（三个点）
   - 不能是 `[path].js` 或其他

2. ❌ **文件位置不对**
   - 必须在 `api/` 目录根级别
   - 不能在子目录中

3. ❌ **vercel.json配置冲突**
   - 旧版的 `routes` 配置会导致问题
   - 必须删除 `routes` 和 `builds`

4. ❌ **缓存问题**
   - Vercel可能使用了旧的部署
   - 需要强制重新部署

---

## ✅ **正确的配置示例**

### **vercel.json**（最简化版本）

```json
{
  "version": 2,
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### **api/[...path].js**（必须导出default函数）

```javascript
export default async function handler(req, res) {
  // 你的代码
}
```

---

**按照以上步骤操作后，应该就能正常工作了！** 🚀

有问题随时告诉我！

