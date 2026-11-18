🏠 SMART HOUSE – HỆ THỐNG QUẢN LÝ NHÀ THÔNG MINH
1. Giới thiệu dự án
Smart House là ứng dụng web quản lý nhà thông minh, được xây dựng bằng HTML5, CSS3 và JavaScript thuần.
Ứng dụng cung cấp giao diện giúp người dùng theo dõi các thông số môi trường, điều khiển thiết bị điện và quản lý lịch sử hoạt động trong nhà.
Website: https://ducanh2909.github.io/smart-house-iot/
Mã nguồn: https://github.com/ducanh2909/smart-house-iot
2. Chức năng chính
2.1. Đăng nhập và đăng ký
Đăng nhập tài khoản.
Đăng ký tài khoản mới.
Quản lý thông tin người dùng.
2.2. Dashboard – Bảng điều khiển
Theo dõi nhiệt độ, độ ẩm và cường độ ánh sáng.
Hiển thị dữ liệu cảm biến bằng biểu đồ.
Điều khiển ba thiết bị:
💡 Đèn.
🌀 Quạt.
❄️ Điều hòa.
2.3. Data Sensor – Dữ liệu cảm biến
Hiển thị danh sách dữ liệu cảm biến.
Lọc dữ liệu theo loại cảm biến.
Tìm kiếm dữ liệu theo giá trị.
Phân trang với 5, 10 hoặc 20 bản ghi mỗi trang.
2.4. History Action – Lịch sử hoạt động
Ghi nhận các thao tác điều khiển thiết bị.
Tìm kiếm lịch sử theo ngày và thời gian.
Lọc các hoạt động đã thực hiện.
2.5. Profile – Hồ sơ cá nhân
Hiển thị thông tin người dùng.
Quản lý thông tin tài khoản.
3. Công nghệ sử dụng
Công nghệ          Mục đích sử dụng
HTML5              Xây dựng cấu trúc trang web
CSS3               Thiết kế giao diện và bố cục
JavaScript ES6     Xử lý logic và các chức năng
LocalStorage       Lưu trữ tài khoản và lịch sử hoạt động
Canvas API         Hiển thị biểu đồ dữ liệu cảm biến
GitHub Pages       Triển khai website trực tuyến
4. Cấu trúc thư mục
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
5. Hướng dẫn cài đặt và sử dụng
Bước 1: Tải mã nguồn
git clone https://github.com/ducanh2909/smart-house-iot.git
Bước 2: Mở thư mục dự án
Sử dụng Visual Studio Code để mở thư mục smart-house-iot.
Bước 3: Khởi chạy ứng dụng
Mở trực tiếp file index.html bằng trình duyệt Chrome, Edge hoặc Firefox.
Hoặc sử dụng tiện ích Live Server trong Visual Studio Code để chạy ứng dụng.
6. Tài khoản dùng thử
Thông tin   Giá trị

Email       anh@smarthouse.local

Mật khẩu    user123

Đây là tài khoản dùng để trải nghiệm các chức năng của ứng dụng.
7. Cơ chế hoạt động hiện tại
Dữ liệu cảm biến được mô phỏng tự động sau mỗi 3 giây bằng JavaScript.
Thông tin tài khoản và lịch sử hoạt động được lưu trữ bằng LocalStorage.
Các thao tác điều khiển thiết bị hiện được xử lý trong ứng dụng web.
Lưu ý: Phiên bản hiện tại chưa kết nối trực tiếp với phần cứng ESP8266 hoặc MQTT Broker. Để sử dụng dữ liệu cảm biến thực tế và điều khiển thiết bị vật lý, cần bổ sung hệ thống kết nối MQTT hoặc Backend phù hợp.
8. Định hướng phát triển
Tích hợp phần cứng ESP8266 / NodeMCU.
Kết nối và thu thập dữ liệu cảm biến thực tế thông qua MQTT.
Xây dựng Backend API và cơ sở dữ liệu.
Nâng cấp hệ thống xác thực và phân quyền người dùng.
Bổ sung chức năng giám sát thiết bị theo thời gian thực.
Phát triển hệ thống thông báo khi có sự kiện bất thường.
9. Giấy phép
Dự án được phát hành theo giấy phép MIT License.
