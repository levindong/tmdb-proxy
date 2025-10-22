# 📱 **LevinStreaming App配置指南**

**目标**：配置App使用Vercel TMDB代理

**前提**：已经部署了Vercel代理并获得了URL

---

## 🎯 **配置步骤**

### **步骤1：获取Vercel代理URL**

部署完成后，你应该得到一个类似这样的URL：

```
https://tmdb-proxy-abc123.vercel.app
```

**注意**：
- ✅ 确保URL以 `https://` 开头
- ✅ 不要在末尾加 `/`
- ✅ 不要包含 `/api` 路径

**完整的API路径示例**：
```
https://tmdb-proxy-abc123.vercel.app/api/trending/movie/week
```

---

### **步骤2：更新App常量配置**

打开文件：

```
LevinStreaming/Core/Utilities/Constants.swift
```

找到这一行：

```swift
static let tmdbProxyURL = "YOUR_VERCEL_URL_HERE" // Replace after deploying!
```

替换为你的Vercel URL（**不包含 /api**）：

```swift
static let tmdbProxyURL = "https://tmdb-proxy-abc123.vercel.app/api"
```

**完整示例**：

```swift
enum API {
    static let tmdbKey = "554926324bc948b82ef676d5e81362ce"
    static let tmdbReadAccessToken = "eyJhbGciOiJIUzI1NiJ9..."
    
    // ✅ 更新这里！
    static let tmdbProxyURL = "https://tmdb-proxy-abc123.vercel.app/api"
    
    static let tmdbDirectURL = "https://api.themoviedb.org/3"
    
    static var tmdbBaseURL: String {
        // Check if user has set a custom proxy URL
        if let customProxy = UserDefaults.standard.string(forKey: Storage.tmdbProxyURL),
           !customProxy.isEmpty,
           customProxy != "YOUR_VERCEL_URL_HERE" {
            print("🌐 Using custom TMDB proxy: \(customProxy)")
            return customProxy
        }
        
        // Check if default proxy is configured
        if tmdbProxyURL != "YOUR_VERCEL_URL_HERE" {
            print("🌐 Using TMDB proxy: \(tmdbProxyURL)")
            return tmdbProxyURL
        }
        
        // Fall back to direct TMDB API
        print("🌐 Using direct TMDB API: \(tmdbDirectURL)")
        return tmdbDirectURL
    }
    
    static let tmdbImageBaseURL = "https://image.tmdb.org/t/p/"
    
    static let requestTimeout: TimeInterval = 30
    static let maxRetryAttempts = 3
}
```

---

### **步骤3：编译并运行App**

在Xcode中：

1. Clean build folder：`Cmd + Shift + K`
2. Build：`Cmd + B`
3. Run：`Cmd + R`

---

### **步骤4：验证配置**

#### **检查控制台日志**

运行App后，在Xcode控制台查找：

```
🌐 Using TMDB proxy: https://tmdb-proxy-abc123.vercel.app/api
📡 Network request: https://tmdb-proxy-abc123.vercel.app/api/trending/movie/week?...
✅ Response received in 0.85s
   Status: 200
   Data size: 123456 bytes
```

#### **如果看到这个，说明配置成功！** ✅

---

## 🧪 **测试清单**

运行App并测试以下功能：

- [ ] **首页加载** - 应该显示Trending Movies/TV Shows
- [ ] **浏览页面** - 切换分类和地区
- [ ] **搜索** - 搜索电影或电视剧
- [ ] **详情页** - 点击任意电影/电视剧
- [ ] **网络速度** - 检查是否比直连TMDB更快

---

## 🔧 **高级配置（可选）**

### **方案A：在Settings中添加代理配置**

允许用户在App内配置自定义代理URL。

#### 1. 更新SettingsView.swift

找到Settings页面并添加一个新的配置项：

```swift
// TMDB Proxy Configuration Section
Section(header: Text("TMDB API Configuration")) {
    HStack {
        Text("Proxy URL")
        Spacer()
        TextField("https://your-proxy.vercel.app/api", 
                  text: $customProxyURL)
            .multilineTextAlignment(.trailing)
            .foregroundColor(.secondary)
    }
    
    Button("Test Connection") {
        testProxyConnection()
    }
    
    if proxyConnectionStatus != nil {
        Text(proxyConnectionStatus!)
            .font(.caption)
            .foregroundColor(proxyConnectionStatus!.contains("✅") ? .green : .red)
    }
}
```

#### 2. 添加ViewModel属性

```swift
@Published var customProxyURL: String = ""
@Published var proxyConnectionStatus: String?

init() {
    // Load saved proxy URL
    if let savedURL = UserDefaults.standard.string(forKey: Constants.Storage.tmdbProxyURL) {
        customProxyURL = savedURL
    }
}

func testProxyConnection() {
    // Test the proxy
    Task {
        do {
            let testURL = customProxyURL.isEmpty ? 
                Constants.API.tmdbProxyURL : customProxyURL
            
            // Simple test request
            let url = URL(string: "\(testURL)/genre/movie/list?language=en-US")!
            let (_, response) = try await URLSession.shared.data(from: url)
            
            if let httpResponse = response as? HTTPURLResponse,
               httpResponse.statusCode == 200 {
                await MainActor.run {
                    proxyConnectionStatus = "✅ Connection successful!"
                    // Save if custom URL was provided
                    if !customProxyURL.isEmpty {
                        UserDefaults.standard.set(customProxyURL, 
                                                 forKey: Constants.Storage.tmdbProxyURL)
                    }
                }
            } else {
                await MainActor.run {
                    proxyConnectionStatus = "❌ Connection failed"
                }
            }
        } catch {
            await MainActor.run {
                proxyConnectionStatus = "❌ Error: \(error.localizedDescription)"
            }
        }
    }
}
```

### **方案B：多代理负载均衡**

如果你部署了多个代理实例：

```swift
enum API {
    static let tmdbProxyURLs = [
        "https://tmdb-proxy-1.vercel.app/api",
        "https://tmdb-proxy-2.vercel.app/api",
        "https://tmdb-proxy-3.vercel.app/api"
    ]
    
    static var tmdbBaseURL: String {
        // Round-robin or random selection
        let index = Int.random(in: 0..<tmdbProxyURLs.count)
        return tmdbProxyURLs[index]
    }
}
```

---

## 🐛 **故障排查**

### **问题1：App无法加载内容**

#### 检查控制台日志

**如果看到**：
```
🌐 Using direct TMDB API: https://api.themoviedb.org/3
```

**说明**：代理未生效，App还在使用直连

**解决方案**：
1. 确认 `Constants.swift` 中的 `tmdbProxyURL` 已正确更新
2. Clean build：`Cmd + Shift + K`
3. 重新编译运行

---

### **问题2：网络请求失败**

#### 检查控制台日志

**如果看到**：
```
❌ Network error: NSURLErrorDomain (code: -1003)
   Description: A server with the specified hostname could not be found
```

**说明**：代理URL不正确或代理服务器未运行

**解决方案**：
1. 在浏览器中测试代理URL：
   ```
   https://your-proxy.vercel.app/api/trending/movie/week?language=en-US&page=1
   ```
2. 如果浏览器也无法访问，检查Vercel部署状态
3. 确认URL格式正确（应包含 `/api` 路径）

---

### **问题3：代理返回404**

#### 检查代理URL格式

❌ **错误格式**：
```swift
static let tmdbProxyURL = "https://your-proxy.vercel.app"
```

✅ **正确格式**：
```swift
static let tmdbProxyURL = "https://your-proxy.vercel.app/api"
```

---

### **问题4：图片无法加载**

**说明**：TMDB图片通常可以直接访问，无需代理

**检查**：
```swift
static let tmdbImageBaseURL = "https://image.tmdb.org/t/p/"
```

如果图片仍然无法加载，可以考虑为图片也设置代理。

---

## 📊 **性能监控**

### **查看网络请求耗时**

控制台会显示每个请求的耗时：

```
✅ Response received in 0.85s
```

**正常范围**：
- 🟢 **< 1s**：优秀
- 🟡 **1-3s**：正常
- 🔴 **> 3s**：需要优化

### **优化建议**

如果响应时间过长：

1. **检查Vercel地区**
   - Vercel会自动部署到最近的边缘节点
   - 确认你的Vercel账号地区设置

2. **启用缓存**
   - `vercel.json` 已配置缓存（`s-maxage=3600`）
   - 第二次请求相同内容应该更快

3. **升级Vercel Pro**
   - 更快的边缘函数
   - 更多带宽
   - 优先级路由

---

## 🔄 **切换回直连TMDB**

如果你想临时切换回直连TMDB（例如在VPN环境下）：

### **方法1：修改代码**

```swift
static let tmdbProxyURL = "YOUR_VERCEL_URL_HERE" // 改回占位符
```

### **方法2：在Settings中切换**

如果实现了Settings配置：

1. 打开Settings
2. 清空"Proxy URL"
3. 点击"Save"

---

## ✅ **配置完成检查清单**

确认以下所有项目：

- [ ] Vercel代理已部署并可访问
- [ ] `Constants.swift` 中的 `tmdbProxyURL` 已更新
- [ ] App已重新编译
- [ ] 控制台显示使用代理URL
- [ ] 首页内容正常加载
- [ ] 浏览和搜索功能正常
- [ ] 详情页可以打开
- [ ] 网络请求响应时间正常

---

## 🎉 **配置成功！**

现在你的LevinStreaming App已经可以：

- ✅ 从中国访问TMDB API
- ✅ 无需VPN
- ✅ 更快的响应速度（Vercel全球CDN）
- ✅ 自动重试和错误处理
- ✅ API Key安全保护

---

## 📞 **需要帮助？**

如果遇到问题：

1. **检查Vercel日志**：
   ```bash
   vercel logs https://your-proxy.vercel.app --follow
   ```

2. **检查App日志**：
   - Xcode控制台
   - 查找 `🌐` `📡` `✅` `❌` 等标记

3. **测试代理**：
   ```bash
   curl "https://your-proxy.vercel.app/api/trending/movie/week?language=en-US&page=1"
   ```

---

**祝使用愉快！** 🚀🎬

如有问题随时问我！

