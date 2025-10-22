# ⚡ **TMDB代理 - 5分钟快速部署**

**解决TMDB在中国无法访问的问题** 🇨🇳 → 🌍

---

## 📋 **部署清单（3步）**

### ✅ **步骤1：安装Vercel CLI**

```bash
npm i -g vercel
```

### ✅ **步骤2：登录并部署**

```bash
cd /Users/dongting/Projects/LevinStreaming/tmdb-proxy
vercel login
vercel --prod
```

交互式问题全部按 **Enter** 使用默认值。

### ✅ **步骤3：记录URL**

部署完成后会显示：

```
✅  Production: https://tmdb-proxy-abc123.vercel.app [1s]
```

**记下这个URL！**

---

## 📱 **配置App（1步）**

打开文件：

```
LevinStreaming/Core/Utilities/Constants.swift
```

找到第20行，替换：

```swift
static let tmdbProxyURL = "YOUR_VERCEL_URL_HERE"
```

改为：

```swift
static let tmdbProxyURL = "https://tmdb-proxy-abc123.vercel.app/api"
```

**注意**：必须加上 `/api` 后缀！

---

## 🧪 **测试（2步）**

### 1. 测试代理

在浏览器访问：

```
https://tmdb-proxy-abc123.vercel.app/api/trending/movie/week?language=en-US&page=1
```

应该看到JSON数据。

### 2. 测试App

在Xcode：
1. Clean: `Cmd + Shift + K`
2. Run: `Cmd + R`

查看控制台，应该显示：

```
🌐 Using TMDB proxy: https://tmdb-proxy-abc123.vercel.app/api
```

---

## ✅ **完成！**

现在你的App可以：
- ✅ 从中国访问TMDB
- ✅ 无需VPN
- ✅ 更快的速度

---

## 📚 **详细文档**

- **部署指南**：`DEPLOYMENT_GUIDE.md`
- **App配置**：`APP_CONFIGURATION_GUIDE.md`
- **API文档**：`README.md`

---

## 🐛 **遇到问题？**

### **代理无法访问**

```bash
vercel ls  # 查看所有部署
vercel logs https://your-url.vercel.app  # 查看日志
```

### **App还是连不上**

确认：
1. `tmdbProxyURL` 包含 `/api` 后缀
2. 已经Clean build
3. 查看Xcode控制台日志

---

## 💡 **提示**

### **免费额度**

Vercel免费版包括：
- 100GB 带宽/月
- 100 req/s
- 足够1000+用户使用

### **监控**

查看使用情况：
https://vercel.com/dashboard

---

**就这么简单！** 🚀

有问题随时问！

