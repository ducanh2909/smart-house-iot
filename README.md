
# 🏠 SMART HOUSE
### Hệ thống quản lý và điều khiển nhà thông minh

Ứng dụng web mô phỏng hệ thống nhà thông minh, cho phép người dùng theo dõi dữ liệu môi trường, điều khiển thiết bị điện và quản lý lịch sử hoạt động.

<p align="center">
  <a href="https://ducanh2909.github.io/smart-house-iot/">
    <strong>🌐 TRẢI NGHIỆM WEBSITE</strong>
  </a>
  |
  <a href="https://github.com/ducanh2909/smart-house-iot">
    <strong>📂 XEM MÃ NGUỒN</strong>
  </a>
</p>

---

## 1. Giới thiệu dự án

**Smart House** được xây dựng bằng HTML5, CSS3 và JavaScript thuần, hướng đến việc mô phỏng giao diện quản lý và điều khiển các thiết bị trong một ngôi nhà thông minh.

Ứng dụng tập trung vào việc giám sát thông số môi trường, quản lý thiết bị và lưu trữ lịch sử thao tác của người dùng.

## 2. Chức năng chính

| Chức năng | Mô tả |
|---|---|
| Đăng nhập / Đăng ký | Quản lý tài khoản người dùng |
| Dashboard | Theo dõi thông số và điều khiển thiết bị |
| Data Sensor | Xem, tìm kiếm và lọc dữ liệu cảm biến |
| History Action | Theo dõi lịch sử hoạt động |
| Profile | Hiển thị thông tin cá nhân |

### Dashboard – Bảng điều khiển

- Theo dõi nhiệt độ, độ ẩm và ánh sáng.
- Hiển thị dữ liệu cảm biến bằng biểu đồ.
- Điều khiển các thiết bị:
  - 💡 Đèn
  - 🌀 Quạt
  - ❄️ Điều hòa

### Data Sensor – Dữ liệu cảm biến

- Hiển thị dữ liệu cảm biến.
- Lọc theo loại cảm biến.
- Tìm kiếm theo giá trị.
- Phân trang 5, 10 hoặc 20 bản ghi.

### History Action – Lịch sử hoạt động

- Ghi nhận thao tác điều khiển thiết bị.
- Tìm kiếm theo ngày và thời gian.
- Theo dõi các hoạt động đã thực hiện.

### Profile – Hồ sơ cá nhân

- Hiển thị thông tin người dùng.
- Quản lý thông tin tài khoản.

## 3. Thiết kế giao diện (Figma)

Giao diện Smart House được thiết kế trên Figma với phong cách hiện đại, sử dụng tông màu xanh dương, trắng và xám nhạt.

Bản thiết kế bao gồm 5 màn hình chính:

- **Dashboard:** Tổng quan hệ thống và trạng thái thiết bị.
- **Điều khiển thiết bị:** Quản lý và điều khiển các thiết bị điện.
- **Dữ liệu cảm biến:** Theo dõi thông số môi trường.
- **Lịch sử thao tác:** Theo dõi lịch sử hoạt động.
- **Thông tin tài khoản:** Quản lý hồ sơ cá nhân.

🔗 **[XEM THIẾT KẾ SMART HOUSE TRÊN FIGMA](https://www.figma.com/design/nbfeTWeuq0GmdO0Smngt63/Untitled?node-id=0-1&t=EVBU6OxrgY1ts32l-1)**

## 4. Công nghệ sử dụng

| Công nghệ | Vai trò |
|---|---|
| HTML5 | Xây dựng cấu trúc trang web |
| CSS3 | Thiết kế giao diện và bố cục |
| JavaScript ES6 | Xử lý chức năng và tương tác |
| LocalStorage | Lưu trữ dữ liệu trên trình duyệt |
| Canvas API | Hiển thị biểu đồ |
| GitHub Pages | Triển khai website |

## 5. Cấu trúc dự án

```text
smart-house-iot/
│
├── css/
│   └── styles.css
│
├── js/
│   └── app.js
│
├── index.html
├── README.md
├── LICENSE
└── .gitignore
```

## 6. Hướng dẫn cài đặt

**Bước 1:** Sao chép mã nguồn:

```bash
git clone https://github.com/ducanh2909/smart-house-iot.git
```

**Bước 2:** Mở thư mục dự án bằng Visual Studio Code.

**Bước 3:** Mở file `index.html` bằng trình duyệt hoặc sử dụng tiện ích Live Server.

## 7. Tài khoản trải nghiệm

| Thông tin | Giá trị |
|---|---|
| Email | anh@smarthouse.local |
| Mật khẩu | user123 |

Đây là tài khoản demo phục vụ việc trải nghiệm ứng dụng.

## 8. Cơ chế hoạt động

- Dữ liệu cảm biến được mô phỏng tự động mỗi 3 giây bằng JavaScript.
- Tài khoản và lịch sử thao tác được lưu trong LocalStorage.
- Các thao tác điều khiển thiết bị hiện được xử lý trong ứng dụng web.

**Lưu ý:** Phiên bản hiện tại chưa kết nối trực tiếp với ESP8266 hoặc MQTT Broker. Dữ liệu cảm biến hiện là dữ liệu mô phỏng, không phải dữ liệu thu thập từ phần cứng thực tế.

## 9. Định hướng phát triển

- Tích hợp ESP8266 / NodeMCU.
- Kết nối cảm biến thực tế thông qua MQTT.
- Xây dựng Backend API và cơ sở dữ liệu.
- Hoàn thiện hệ thống phân quyền người dùng.
- Bổ sung chức năng giám sát và thông báo theo thời gian thực.

## 10. Giấy phép

Dự án sử dụng giấy phép MIT License.
