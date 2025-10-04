import requests
import json

# 配置参数
API_KEY = "allen123"  # 你的代理服务器 API 密钥
MODEL_NAME = "gemini-2.5-flash"  # 正确的模型名称格式
API_URL = f"http://localhost:8787/v1/models/{MODEL_NAME}:generateContent"

# 请求头
headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY  # 注意是小写x
}

# 请求数据 - 添加必需的role字段
payload = {
    "contents": [
        {
            "role": "user",  # 必需的role字段
            "parts": [
                {"text": "中国首都是哪个城市？你的模型名字是什么？简洁回答！"}
            ]
        }
    ],
    "generationConfig": {
        "temperature": 0.5,
        "maxOutputTokens": 1024
    }
}

# 发送请求
try:
    print(f"🚀 正在请求模型: {MODEL_NAME}...")
    print(f"🔑 使用 API Key: {API_KEY}")
    print(f"🌐 请求地址: {API_URL}")
    print()
    
    response = requests.post(
        API_URL,
        headers=headers,
        json=payload,
        timeout=30  # 增加超时时间
    )
    
    print(f"📡 响应状态码: {response.status_code}")
    
    if response.status_code == 200:
        # 解析响应
        result = response.json()
        
        # 改进的响应处理逻辑
        if "candidates" in result and result["candidates"]:
            candidate = result["candidates"][0]
            # 检查是否有content和parts
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if parts and len(parts) > 0 and "text" in parts[0]:
                    generated_text = parts[0]["text"]
                    
                    # 获取使用统计
                    usage_metadata = result.get("usageMetadata", {})
                    prompt_tokens = usage_metadata.get("promptTokenCount", "N/A")
                    completion_tokens = usage_metadata.get("candidatesTokenCount", "N/A")
                    total_tokens = usage_metadata.get("totalTokenCount", "N/A")
                    
                    print("✅ 请求成功！")
                    print(f"📦 模型: {MODEL_NAME}")
                    print(f"🔢 Token使用: 输入={prompt_tokens}, 输出={completion_tokens}, 总计={total_tokens}")
                    print("-" * 50)
                    print(generated_text)
                    print("-" * 50)
                    print()
                    print("🎉 allen123 API Key 工作正常！")
                    print("✅ 本地项目 -> 代理服务器 -> Google API 链路正常")
                else:
                    print("⚠️ 响应中没有找到文本内容")
                    print(json.dumps(result, indent=2, ensure_ascii=False))
            else:
                print("⚠️ 响应结构异常 - 缺少content或parts")
                print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print("⚠️ 响应中没有candidates")
            print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif response.status_code == 401:
        print("❌ 401 Unauthorized")
        print("💡 可能的原因:")
        print("   1. allen123 不是正确的 API Key")
        print("   2. 代理服务器配置问题")
        print("   3. 本地项目没有正确转发 API Key")
        print()
        print("🔧 调试信息:")
        print(f"   响应内容: {response.text}")
        
    elif response.status_code == 400:
        print("❌ 400 Bad Request")
        print("💡 可能的原因:")
        print("   1. 请求格式错误")
        print("   2. 模型名称不正确")
        print("   3. 参数配置问题")
        print()
        print("🔧 调试信息:")
        print(f"   响应内容: {response.text}")
        
    else:
        print(f"❌ 请求失败: {response.status_code}")
        print(f"响应内容: {response.text}")

except requests.exceptions.ConnectionError:
    print("❌ 连接失败")
    print("💡 请确保本地开发服务器正在运行:")
    print("   pnpm dev")
    
except requests.exceptions.Timeout:
    print("❌ 请求超时")
    print("💡 网络可能较慢，请稍后重试")
    
except requests.exceptions.RequestException as err:
    print(f"❌ 网络请求错误: {err}")
    
except Exception as err:
    print(f"❗ 未知错误: {type(err).__name__} - {str(err)}")