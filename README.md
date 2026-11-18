# Smart House - HTML, CSS và JavaScript thuần

## Công nghệ sử dụng
- HTML5: cấu trúc trang.
- CSS3: giao diện, bố cục và responsive.
- JavaScript thuần (ES6): xử lý đăng nhập, thiết bị, cảm biến, biểu đồ, tìm kiếm và phân trang.
- Không sử dụng React, Vite hoặc thư viện giao diện bên ngoài.

## Cách chạy
1. Giải nén thư mục dự án.
2. Mở thư mục `smart-house-html-css-js`.
3. Mở file `index.html` bằng Chrome, Edge hoặc Firefox.

Có thể dùng extension Live Server trong VS Code để chạy thuận tiện hơn.

## Tài khoản demo
- Email: `anh@smarthouse.local`
- Mật khẩu: `user123`

## Cấu trúc thư mục
```text
smart-house-html-css-js/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

## Chức năng
- Đăng nhập và đăng ký tài khoản.
- Dashboard điều khiển Đèn, Quạt, Điều hòa.
- Biểu đồ nhiệt độ, độ ẩm và ánh sáng theo ADC (0–1023).
- Data Sensor: lọc Nhiệt độ, Độ ẩm, Ánh sáng; tìm theo giá trị.
- History Action: tìm theo ngày và thời gian.
- Hai bảng hỗ trợ phân trang 5, 10, 20 dòng.
- Profile hiển thị Trần Đức Anh và mã sinh viên B23DCAT019.
- Dữ liệu tài khoản và lịch sử thao tác được lưu trong localStorage.

## Lưu ý
Dữ liệu cảm biến hiện được mô phỏng tự động mỗi 3 giây bằng JavaScript.
Chưa kết nối trực tiếp ESP8266 hoặc MQTT. Muốn sử dụng dữ liệu thật
cần bổ sung kết nối MQTT/backend phù hợp.
