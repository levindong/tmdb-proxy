# 🚀 **Vercel部署完整指南**

**目标**：将TMDB代理服务器部署到Vercel，让中国用户无需VPN即可访问。

**预计时间**：5-10分钟

---

## 📋 **准备工作**

### ✅ **检查清单**

- [ ] 有Vercel账号（没有的话去 https://vercel.com/signup 免费注册）
- [ ] 安装了Node.js（执行 `node --version` 检查）
- [ ] 有GitHub账号（推荐，用于自动部署）

---

## 🎯 **方案A：使用Vercel CLI（推荐，最快）**

### **步骤1：安装Vercel CLI**

打开终端，执行：

```bash
npm i -g vercel
```

### **步骤2：登录Vercel**

```bash
vercel login
```

这会打开浏览器，选择登录方式：
- GitHub（推荐）
- GitLab
- Bitbucket
- Email

### **步骤3：部署项目**

```bash
cd /Users/dongting/Projects/LevinStreaming/tmdb-proxy
vercel --prod
```

**交互式问题回答**：

```
? Set up and deploy "~/Projects/LevinStreaming/tmdb-proxy"? 
› Yes

? Which scope do you want to deploy to? 
› Your Username

? Link to existing project? 
› No

? What's your project's name? 
› tmdb-proxy (或任何你喜欢的名字)

? In which directory is your code located? 
› ./ (按Enter，使用当前目录)
```

### **步骤4：等待部署完成**

Vercel会自动：
1. ✅ 上传代码
2. ✅ 构建项目
3. ✅ 部署到全球CDN
4. ✅ 生成HTTPS域名

**完成！** 🎉

你会看到类似输出：

```
✅  Production: https://tmdb-proxy-abc123.vercel.app [1s]
```

**记下这个URL！** 稍后需要在App中配置。

---

## 🌐 **方案B：使用Vercel Dashboard（可视化）**

### **步骤1：创建GitHub仓库（可选但推荐）**

```bash
cd /Users/dongting/Projects/LevinStreaming/tmdb-proxy
git init
git add .
git commit -m "Initial commit: TMDB proxy for LevinStreaming"

# 在GitHub创建一个新仓库，然后：
git remote add origin https://github.com/YOUR_USERNAME/tmdb-proxy.git
git push -u origin main
```

### **步骤2：在Vercel导入项目**

1. 访问 https://vercel.com/new
2. 选择"Import Git Repository"
3. 连接你的GitHub账号
4. 选择 `tmdb-proxy` 仓库
5. 点击 "Deploy"

**完成！** 🎉

### **步骤3：获取部署URL**

部署完成后，Vercel会显示：

```
Your project is live at:
https://tmdb-proxy.vercel.app
```

---

## 🧪 **测试代理**

### **方法1：使用浏览器**

访问：

```
https://YOUR-PROJECT.vercel.app/api/trending/movie/week?language=en-US&page=1
```

应该看到JSON响应，包含热门电影列表。

### **方法2：使用curl**

```bash
curl "https://YOUR-PROJECT.vercel.app/api/trending/movie/week?language=en-US&page=1"
```

### **方法3：测试不同的端点**

**获取电影详情：**
```
https://YOUR-PROJECT.vercel.app/api/movie/604079?language=en-US
```

**搜索电影：**
```
https://YOUR-PROJECT.vercel.app/api/search/movie?query=avengers&language=en-US
```

**获取电影分类：**
```
https://YOUR-PROJECT.vercel.app/api/genre/movie/list?language=en-US
```

---

## 🔧 **配置自定义域名（可选）**

### **使用Vercel子域名（免费）**

默认情况下，Vercel会给你：
```
https://your-project.vercel.app
```

### **使用自定义域名**

1. 进入Vercel Dashboard → 你的项目 → Settings → Domains
2. 添加你的域名（例如：`api.yourapp.com`）
3. 按照指示配置DNS记录
4. Vercel自动提供免费HTTPS证书

---

## 📊 **监控和日志**

### **查看实时日志**

#### 方法1：Vercel Dashboard

访问：https://vercel.com/dashboard

选择你的项目 → Logs

#### 方法2：CLI

```bash
vercel logs https://your-project.vercel.app --follow
```

### **查看分析数据**

Vercel Dashboard → 你的项目 → Analytics

可以看到：
- 请求数量
- 响应时间
- 错误率
- 流量来源

---

## 🔄 **更新部署**

### **如果使用CLI部署**

修改代码后：

```bash
cd /Users/dongting/Projects/LevinStreaming/tmdb-proxy
vercel --prod
```

### **如果使用GitHub + Vercel**

只需要：

```bash
git add .
git commit -m "Update proxy configuration"
git push
```

Vercel会自动检测并重新部署！

---

## 🛡️ **安全建议**

### **1. 使用环境变量保护API Key**

不要把API Key硬编码在代码里！

#### 在Vercel Dashboard设置环境变量：

1. Vercel Dashboard → 你的项目 → Settings → Environment Variables
2. 添加变量：
   - Name: `TMDB_API_KEY`
   - Value: `554926324bc948b82ef676d5e81362ce`
   - Environment: All (Production, Preview, Development)
3. 点击 "Save"

#### 修改代码使用环境变量：

编辑 `api/[...path].js`：

```javascript
// 从环境变量读取，如果没有则使用默认值
const TMDB_API_KEY = process.env.TMDB_API_KEY || '554926324bc948b82ef676d5e81362ce';
```

#### 重新部署：

```bash
vercel --prod
```

### **2. 限制CORS源（生产环境推荐）**

如果只想让你的App访问代理，修改 `api/[...path].js`：

```javascript
const ALLOWED_ORIGINS = [
  'https://your-app-domain.com',
  'capacitor://localhost',  // Capacitor apps
  'ionic://localhost'       // Ionic apps
];

const corsHeaders = {
  'Access-Control-Allow-Origin': req.headers.origin || '*',
  // ...
};

// 验证来源
if (ALLOWED_ORIGINS.includes(req.headers.origin)) {
  // Allow request
} else {
  // Reject
}
```

### **3. 添加速率限制**

Vercel免费版自带100 req/s限制。如需更多控制，可以使用 `@upstash/ratelimit`。

---

## 💰 **成本估算**

### **Vercel免费额度**

- ✅ 100GB带宽/月
- ✅ 100 req/s
- ✅ 无限项目
- ✅ 自动HTTPS
- ✅ 全球CDN

### **预估使用量**

**假设每个用户：**
- 启动App：5个API请求
- 浏览内容：10个API请求/分钟
- 平均会话：15分钟

**每个用户每次使用：** ~150个请求

**免费额度可支持：**
- 每天活跃用户：1000+
- 每月API请求：3,000,000+

**对于小到中型App，免费版足够！**

### **何时需要升级到Pro（$20/月）**

- 每天活跃用户 > 5,000
- 需要更高带宽
- 需要团队协作
- 需要高级分析

---

## 🐛 **常见问题**

### **Q1: 部署失败，显示"No token found"**

**解决方案：**
```bash
vercel logout
vercel login
vercel --prod
```

### **Q2: 代理返回404错误**

**检查URL格式：**

❌ 错误：
```
https://your-project.vercel.app/trending/movie/week
```

✅ 正确：
```
https://your-project.vercel.app/api/trending/movie/week
```

### **Q3: TMDB返回401 Unauthorized**

**原因**：API Key无效

**解决方案**：
1. 检查 `api/[...path].js` 中的 `TMDB_API_KEY`
2. 或者在Vercel Dashboard设置环境变量
3. 重新部署

### **Q4: 响应很慢**

**可能原因**：
1. TMDB API本身较慢
2. 第一次请求（冷启动）

**优化方案**：
- 启用Vercel缓存（已在 `vercel.json` 中配置）
- 使用CDN缓存
- 升级到Vercel Pro（更快的边缘函数）

### **Q5: 超过免费额度怎么办？**

**方案1**：升级到Pro ($20/月)

**方案2**：添加缓存层
- 使用Vercel KV（Redis）
- 缓存热门内容24小时
- 减少到TMDB的实际请求

**方案3**：多个代理
- 部署多个Vercel项目
- 在App中实现负载均衡

---

## 📞 **获取帮助**

### **Vercel支持**

- 文档：https://vercel.com/docs
- 社区：https://github.com/vercel/vercel/discussions
- Twitter：@vercel

### **TMDB API**

- 文档：https://developers.themoviedb.org/3
- 论坛：https://www.themoviedb.org/talk

---

## ✅ **部署检查清单**

完成部署后，确认：

- [ ] 代理URL可以访问
- [ ] 测试API端点返回正确数据
- [ ] 记录了代理URL（下一步需要配置到App）
- [ ] （可选）配置了环境变量
- [ ] （可选）设置了自定义域名
- [ ] （可选）启用了Vercel Analytics

---

## 🎯 **下一步**

**代理部署完成！** 🎉

接下来需要：

1. **更新App配置**，使用新的代理URL
2. **测试App**，确保所有功能正常
3. **监控使用情况**，通过Vercel Dashboard

详见：`APP_CONFIGURATION_GUIDE.md`

---

**祝部署顺利！** 🚀

有问题随时问我！

