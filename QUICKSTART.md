# 📖 Hướng dẫn sử dụng nhanh - Selenium Data-Driven Testing

## 🚀 Bắt đầu nhanh

### 1. **Cài đặt dependencies:**

```bash
npm install
```

### 2. **Tạo dữ liệu test:**

```bash
npm run generate:users
```

### 3. **Chạy test:**

````bash
# Test với Mocha + Mochawesome
npm test



## 🌐 Multi-Browser Testing

### Test trên các browser khác nhau:

```bash
# Chrome (mặc định)
npm run test:chrome

# Firefox
npm run test:firefox

# Microsoft Edge
npm run test:edge

# Test trên tất cả browsers
npm run test:all-browsers
````

### Headless Mode (chạy nền không hiển thị browser):

```bash
# Chrome headless
npm run test:headless-chrome

# Firefox headless
npm run test:headless-firefox

# Chế độ headless chung
npm run test:headless
```

## ⚙️ Cấu hình Test

### Environment variables available:

```bash
# Number of users to test (default: 2)
set MAX_USERS=5 && npm test

# Browser (chrome/firefox/edge)
set BROWSER=firefox && npm test

# Headless mode
set HEADLESS=true && npm test

# Screen resolution (default: 1920x1080)
set SCREEN_WIDTH=1366 && set SCREEN_HEIGHT=768 && npm test

# Zoom level for better screenshot coverage (default: 0.5 = 50%)
set ZOOM_LEVEL=0.75 && npm test

# Timeout configurations (all in milliseconds)
set TIMEOUT_IMPLICIT=3000 && npm test    # Faster element finding
set TIMEOUT_PAGELOAD=10000 && npm test   # Faster page loads
set TIMEOUT_ELEMENT=3000 && npm test     # Faster element waits
set TIMEOUT_TESTCASE=15000 && npm test   # Faster test case timeout

# Combine multiple configurations
set BROWSER=chrome && set MAX_USERS=3 && set HEADLESS=true && npm test
set BROWSER=firefox && set SCREEN_WIDTH=1440 && set SCREEN_HEIGHT=900 && set ZOOM_LEVEL=0.6 && npm test
```

### Common screen resolutions:

- **Full HD**: 1920x1080 (default)
- **HD**: 1366x768 (common laptop)
- **MacBook**: 1440x900
- **4K**: 3840x2160
- **Ultrawide**: 2560x1080

### Zoom levels for screenshot coverage:

- **0.5**: 50% zoom (default - captures more content)
- **0.75**: 75% zoom (balanced view)
- **1.0**: 100% zoom (normal size)
- **0.25**: 25% zoom (maximum content coverage)

### Timeout configurations (faster error detection):

- **Implicit Wait**: 5s (default) - How long to wait for elements
- **Page Load**: 15s (default) - How long to wait for pages to load
- **Element Wait**: 5s (default) - How long to wait for specific elements
- **Test Case**: 20s (default) - How long each test can run
- **Test Suite**: 60s (default) - How long entire test suite can run
- **Setup/Teardown**: 45s (default) - How long setup/cleanup can take

## 🎯 Các lệnh có sẵn

| Lệnh                        | Mô tả                                      |
| --------------------------- | ------------------------------------------ |
| `npm run generate:users`    | Tạo dữ liệu người dùng ngẫu nhiên          |
| `npm test`                  | Chạy test với Mocha + Mochawesome reporter |
| `npm run data-driven`       | Chạy test đơn giản với vanilla JavaScript  |
| `npm run test:chrome`       | Chạy test trên Chrome                      |
| `npm run test:firefox`      | Chạy test trên Firefox                     |
| `npm run test:edge`         | Chạy test trên Microsoft Edge              |
| `npm run test:all-browsers` | Chạy test tuần tự trên tất cả browsers     |
| `npm run test:headless`     | Chạy test ở chế độ headless                |
| `npm run merge-reports`     | Gộp báo cáo từ nhiều lần chạy test         |

## 📊 Báo cáo và Screenshots

### Báo cáo HTML được tạo tại:

- `reports/test-report.html` - Báo cáo HTML đẹp mắt với Mochawesome
- `reports/test-report.json` - Dữ liệu báo cáo JSON

### Screenshots khi test failed:

- `screenshots/` - Tự động chụp màn hình khi test bị lỗi
- Format: `[test_name]_[browser]_[timestamp].png`

### Mở báo cáo sau khi test:

```bash
# Windows
start reports/test-report.html

# Hoặc dùng trình duyệt
# Mở file reports/test-report.html trong browser
```

## 🔧 Cấu trúc Project

```
📁 demo_Selenium/
├── 📁 data/
│   └── users_random_500.json          # Dữ liệu test users
├── 📁 tests/
│   ├── mocha-data-driven.test.js       # Test với Mocha framework
│   └── generate_random_users.js        # Script tạo dữ liệu
├── 📁 reports/                         # Báo cáo HTML/JSON
├── 📁 screenshots/                     # Ảnh chụp khi test failed
├── package.json                        # Cấu hình npm
└── QUICKSTART.md                       # File này
```

## 🧪 Test Cases được thực hiện

### 1. **Positive Test Cases:**

- ✅ Đăng ký tài khoản mới với thông tin hợp lệ
- ✅ Đăng nhập với tài khoản vừa tạo
- ✅ Kiểm tra thông tin profile sau khi đăng nhập
- ✅ Logout khỏi hệ thống

### 2. **Negative Test Cases:**

- ❌ Đăng ký với email không hợp lệ
- ❌ Đăng nhập với password sai
- ❌ Xử lý trường hợp email đã tồn tại

### 3. **Data-Driven Testing:**

- 📊 Chạy test với nhiều bộ dữ liệu từ file JSON
- 📊 Kiểm tra với người dùng từ nhiều quốc gia khác nhau
- 📊 Validate với các định dạng dữ liệu đa dạng

## 🐛 Debug và Troubleshooting

### Khi test failed:

1. **Kiểm tra screenshots** trong thư mục `screenshots/`
2. **Xem báo cáo chi tiết** trong `reports/test-report.html`
3. **Chạy test với browser hiển thị** (không headless) để debug

### Debug Commands:

```bash
# Chạy với ít users để debug nhanh
set MAX_USERS=1 && npm test

# Chạy với browser hiển thị để xem trực quan
set HEADLESS=false && npm test:chrome

# Chạy test đơn giản để debug
npm run data-driven
```

### Các lỗi thường gặp:

1. **Browser driver không tìm thấy:**

   ```bash
   # Cài đặt browser drivers
   npm install chromedriver geckodriver edgedriver
   ```

2. **Timeout errors:**

   - Kiểm tra kết nối internet
   - Tăng timeout trong test nếu cần
   - Chạy với headless=false để quan sát

3. **Element không tìm thấy:**
   - Website có thể thay đổi cấu trúc
   - Kiểm tra screenshots để xem trang web hiện tại
   - Cập nhật selectors nếu cần

## 🎯 Best Practices

### 1. **Chạy test hiệu quả:**

```bash
# Test nhanh với headless mode
npm run test:headless-chrome

# Test đầy đủ trên nhiều browsers
npm run test:all-browsers

# Debug với 1 user và browser hiển thị
set MAX_USERS=1 && set HEADLESS=false && npm test
```

### 2. **Quản lý dữ liệu test:**

```bash
# Tạo dữ liệu mới khi cần
npm run generate:users

# Kiểm tra file data/users_random_500.json trước khi test
```

### 3. **Xem báo cáo:**

- Luôn kiểm tra `reports/test-report.html` sau khi test
- Lưu screenshots quan trọng cho việc báo cáo bugs
- Sử dụng merge-reports khi chạy test nhiều lần

## 📝 Ghi chú

- **Website test:** https://practicesoftwaretesting.com/
- **Test framework:** Mocha + Chai + Selenium WebDriver
- **Reporter:** Mochawesome (HTML reports)
- **Browsers hỗ trợ:** Chrome, Firefox, Microsoft Edge
- **Platform:** Windows, macOS, Linux

### Happy Testing! 🎉

| ------------------------ | -------------------------------- |
| `npm test` | Chạy test cơ bản với 3 users |
| `npm run test:fast` | Test nhanh với 1 user (headless) |
| `npm run test:headless` | Test không hiển thị browser |
| `npm run test:html` | Tạo báo cáo HTML |
| `npm run test:allure` | Tạo báo cáo Allure |
| `npm run generate:users` | Tạo dữ liệu test mới |

## 🔧 Tùy chỉnh nâng cao

```bash
# Test với Firefox, 5 users
node run-tests.js --browser firefox --users 5

# Test headless với báo cáo JSON
node run-tests.js --headless --reporter json --output results.json

# Test full với 10 users và báo cáo Allure
node run-tests.js --users 10 --reporter allure
```

## 📊 Xem báo cáo

- **HTML Report:** Mở file `reports/test-report.html`
- **Allure Report:** Chạy `npm run report:allure`
- **JSON Results:** File `test-results.json`

## ⚡ Tips

- Sử dụng `--headless` để test nhanh hơn
- Giới hạn số users khi debug: `--users 1`
- Screenshots tự động lưu khi test fail trong thư mục `screenshots/`
