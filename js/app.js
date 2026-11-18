/* 1. Dữ liệu và cấu hình */
const PROJECT_RESOURCES = {
  figma: "",
  report: "",
  github: "",
  swagger: ""
};

const STORAGE = {
  users: "smarthouse_vanilla_users",
  session: "smarthouse_vanilla_session",
  history: "smarthouse_vanilla_history"
};

const demoUser = {
  id: 2,
  name: "Trần Đức Anh",
  studentId: "B23DCAT019",
  email: "anh@smarthouse.local",
  password: "user123"
};

const initialUsers = [
  {
    id: 1,
    name: "Administrator",
    email: "admin@smarthouse.local",
    password: "admin123"
  },
  demoUser
];

const initialHistory = [
  {
    id: "ACT-0001",
    device: "Đèn",
    action: "Bật thiết bị",
    source: "Website",
    date: "10/11/2026",
    time: "08:42:16",
    status: "success"
  },
  {
    id: "ACT-0002",
    device: "Quạt",
    action: "Tắt thiết bị",
    source: "Website",
    date: "10/11/2026",
    time: "08:35:02",
    status: "success"
  }
];

const sensor = {
  temperature: 26.8,
  humidity: 63,
  light: 78
};

const selectedChartPoints = {};

const sensorHistory = [
  { time: "−30s", temperature: 25.1, humidity: 68, light: 18 },
  { time: "−25s", temperature: 25.8, humidity: 66, light: 28 },
  { time: "−20s", temperature: 26.4, humidity: 64, light: 46 },
  { time: "−15s", temperature: 27.1, humidity: 61, light: 62 },
  { time: "−10s", temperature: 27.4, humidity: 60, light: 74 },
  { time: "−5s", temperature: 27.0, humidity: 62, light: 81 },
  { time: "Hiện tại", temperature: 26.8, humidity: 63, light: 78 }
];

const devices = [
  {
    id: "light",
    name: "Đèn",
    room: "Phòng khách",
    detail: "Độ sáng 80%",
    icon: "💡",
    on: true
  },
  {
    id: "fan",
    name: "Quạt",
    room: "Phòng ngủ",
    detail: "Tốc độ tự động",
    icon: "🌀",
    on: false
  },
  {
    id: "ac",
    name: "Điều hòa",
    room: "Phòng khách",
    detail: "26°C · Làm mát",
    icon: "❄️",
    on: true
  }
];

let currentUser = readStorage(STORAGE.session, null);
let users = readStorage(STORAGE.users, initialUsers);
let historyRecords = readStorage(STORAGE.history, initialHistory);
let currentPage = "dashboard";
let authMode = "login";
let sensorPage = 1;
let historyPage = 1;
let sensorPageSize = 5;
let historyPageSize = 5;
let sensorTypeFilter = "all";
let sensorValueSearch = "";
let sensorTimeSearch = "";
let historyTimeSearch = "";
let historyTimeDraft = "";
let historyDeviceFilter = "all";
let historyDeviceDraft = "all";
let historyActionFilter = "all";
let historyActionDraft = "all";
let historyStatusFilter = "all";
let historyStatusDraft = "all";
let sensorRecords = createInitialSensorRecords();

/* 2. Hàm hỗ trợ */
function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[char];
  });
}

function formatDate(date) {
  return date.toLocaleDateString("vi-VN");
}

function formatTime(date) {
  return date.toLocaleTimeString("vi-VN", {
    hour12: false
  });
}

function formatDateTime(date) {
  return formatDate(date) + " " + formatTime(date);
}

function lightToADC(value) {
  return Math.round(value * 10.23);
}

function createInitialSensorRecords() {
  const now = formatDateTime(new Date());

  return [
    {
      id: "TEMP-001",
      type: "Nhiệt độ",
      value: "26.8 °C",
      time: now
    },
    {
      id: "HUM-001",
      type: "Độ ẩm",
      value: "63 %",
      time: now
    },
    {
      id: "LIGHT-001",
      type: "Ánh sáng",
      value: "798 ADC",
      time: now
    }
  ];
}

/* 3. Đăng nhập và đăng ký */
function renderAuth() {
  const isLogin = authMode === "login";

  document.getElementById("app").innerHTML = `
    <main class="auth-screen">
      <section class="auth-card">
        <div class="brand-mark">⌂</div>
        <div class="eyebrow">SMART LIVING PLATFORM</div>
        <h1>${isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h1>
        <p>
          ${isLogin
            ? "Đăng nhập để quản lý ngôi nhà thông minh."
            : "Đăng ký để bắt đầu sử dụng Smart House."}
        </p>

        <div class="auth-tabs">
          <button
            class="${isLogin ? "active" : ""}"
            data-auth-mode="login">
            Đăng nhập
          </button>
          <button
            class="${!isLogin ? "active" : ""}"
            data-auth-mode="register">
            Đăng ký
          </button>
        </div>

        <form id="auth-form">
          ${isLogin ? "" : `
            <label class="form-field">
              Họ và tên
              <input
                name="name"
                type="text"
                placeholder="Nguyễn Văn A"
                required>
            </label>
          `}

          <label class="form-field">
            Email
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required>
          </label>

          <label class="form-field">
            Mật khẩu
            <input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              required>
          </label>

          <div id="auth-error" class="auth-error"></div>
          <button class="primary-button auth-submit" type="submit">
            ${isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </form>

        <div class="demo-info">
          <strong>Tài khoản trải nghiệm</strong><br>
          Admin: admin@smarthouse.local / admin123<br>
          User: anh@smarthouse.local / user123
        </div>
      </section>
    </main>
  `;

  document.querySelectorAll("[data-auth-mode]").forEach(function (button) {
    button.addEventListener("click", function () {
      authMode = button.dataset.authMode;
      renderAuth();
    });
  });

  document
    .getElementById("auth-form")
    .addEventListener("submit", handleAuth);
}

function handleAuth(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");
  const errorBox = document.getElementById("auth-error");

  if (authMode === "login") {
    const account = users.find(function (user) {
      return user.email.toLowerCase() === email
        && user.password === password;
    });

    if (!account) {
      errorBox.textContent = "Email hoặc mật khẩu không chính xác.";
      return;
    }

    currentUser = account;
    saveStorage(STORAGE.session, currentUser);
    renderApp();
    return;
  }

  const name = formData.get("name").trim();
  const exists = users.some(function (user) {
    return user.email.toLowerCase() === email;
  });

  if (exists) {
    errorBox.textContent = "Email này đã được đăng ký.";
    return;
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    studentId: ""
  };

  users.push(newUser);
  saveStorage(STORAGE.users, users);

  currentUser = newUser;
  saveStorage(STORAGE.session, currentUser);
  renderApp();
}

/* 4. Khung giao diện và điều hướng */
function renderApp() {
  if (!currentUser) {
    renderAuth();
    return;
  }

  document.getElementById("app").innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-mark">⌂</div>
          <div>
            <strong>smart<span style="color:#8fa8ff">house.</span></strong>
            <small>CONTROL CENTER</small>
          </div>
        </div>

        <div class="home-status">
          <span class="status-dot"></span>
          <div>
            <strong>Home is online</strong>
            <small>Hệ thống đang hoạt động</small>
          </div>
        </div>

        <nav class="side-nav">
          <button class="nav-link" data-page="dashboard">
            ▦ &nbsp; Dashboard
          </button>
          <button class="nav-link" data-page="sensors">
            ◉ &nbsp; Data Sensor
          </button>
          <button class="nav-link" data-page="history">
            ◷ &nbsp; History Action
          </button>
          <button class="nav-link" data-page="profile">
            ◉ &nbsp; Profile
          </button>
        </nav>

        <div class="sidebar-bottom">
          <div class="tip-card">
            <strong>Smart home tip</strong>
            Giám sát cảm biến thường xuyên để tối ưu năng lượng.
          </div>
          <div class="user-mini">
            <div class="avatar">${escapeHTML(currentUser.name.charAt(0))}</div>
            <div>
              <strong>${escapeHTML(currentUser.name)}</strong>
              <small>Người dùng</small>
            </div>
            <button class="logout-icon" data-logout title="Đăng xuất">
              ↪
            </button>
          </div>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div>
            <div class="breadcrumb">
              Smart House / <span id="breadcrumb-page">Dashboard</span>
            </div>
            <h2 id="topbar-title">Dashboard</h2>
          </div>
          <div class="topbar-user">
            ${escapeHTML(currentUser.name)}
          </div>
        </header>

        <section class="content" id="page-content"></section>
      </main>
    </div>
  `;

  document.querySelectorAll("[data-page]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentPage = button.dataset.page;
      renderPage();
    });
  });

  document.querySelector("[data-logout]")
    .addEventListener("click", logout);

  renderPage();
}

function renderPage() {
  const pageNames = {
    dashboard: "Dashboard",
    sensors: "Data Sensor",
    history: "History Action",
    profile: "Profile"
  };

  document.getElementById("breadcrumb-page").textContent =
    pageNames[currentPage];

  document.getElementById("topbar-title").textContent =
    pageNames[currentPage];

  document.querySelectorAll("[data-page]").forEach(function (button) {
    button.classList.toggle(
      "active",
      button.dataset.page === currentPage
    );
  });

  if (currentPage === "dashboard") {
    renderDashboard();
  } else if (currentPage === "sensors") {
    renderSensors();
  } else if (currentPage === "history") {
    renderHistory();
  } else {
    renderProfile();
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem(STORAGE.session);
  renderAuth();
}

/* 5. Dashboard */
function renderDashboard() {
  const activeDevices = devices.filter(function (device) {
    return device.on;
  }).length;

  const content = document.getElementById("page-content");

  content.innerHTML = `
    <div class="welcome-row">
      <div>
        <div class="eyebrow">SMART HOME · LIVE MONITORING</div>
        <h1>Xin chào, ngôi nhà của bạn 👋</h1>
        <p>Dữ liệu cảm biến tự động cập nhật mỗi 3 giây.</p>
      </div>
    </div>

    <div class="stat-grid dashboard-summary-grid">
      ${createStatCard("Nhiệt độ", sensor.temperature.toFixed(1), "°C")}
      ${createStatCard("Độ ẩm", sensor.humidity, "%")}
      ${createStatCard("Ánh sáng", lightToADC(sensor.light), "ADC")}

      <div class="device-control-panel summary-device-panel">
        <div class="panel-heading">
          <div>
            <h3>Điều khiển thiết bị</h3>
            <p>Quản lý thiết bị trong nhà</p>
          </div>
          <span class="mini-tag">${activeDevices} ACTIVE</span>
        </div>
        <div class="device-grid">
          ${devices.map(createDeviceCard).join("")}
        </div>
      </div>
    </div>

    <div class="dashboard-lower chart-comparison">
      <div class="panel">
        <div class="panel-heading">
          <div>
            <h3>Nhiệt độ & độ ẩm</h3>
            <p>Diễn biến theo thời gian</p>
          </div>
          <span class="live-label">● LIVE</span>
        </div>
        <canvas id="climate-chart" class="chart-canvas"></canvas>
        <div id="climate-point-details" class="chart-point-details">
          Nhấn vào một điểm trên biểu đồ để xem giá trị.
        </div>
      </div>

      <div class="panel">
        <div class="panel-heading">
          <div>
            <h3>Cường độ ánh sáng</h3>
            <p>Giá trị ánh sáng theo thời gian</p>
          </div>
          <span class="live-label">● LIVE</span>
        </div>
        <canvas id="light-chart" class="chart-canvas"></canvas>
        <div id="light-point-details" class="chart-point-details">
          Nhấn vào một điểm trên biểu đồ để xem giá trị ADC.
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-device]").forEach(function (button) {
    button.addEventListener("click", function () {
      toggleDevice(button.dataset.device);
    });
  });

  drawDashboardCharts();
}

function createStatCard(label, value, unit) {
  return `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value">
        ${value}<span>${unit}</span>
      </div>
    </div>
  `;
}

function createDeviceCard(device) {
  return `
    <article class="device-card">
      <div class="device-main">
        <div class="device-icon">${device.icon}</div>
        <div class="device-info">
          <h3>${device.name}</h3>
          <p>${device.room} · ${device.detail}</p>
        </div>
      </div>

      <div class="device-controls">
        <span class="device-state ${device.on ? "on" : "off"}">
          ${device.on ? "ON" : "OFF"}
        </span>
        <span class="device-description">
          ${device.on ? "Đang hoạt động" : "Đang tắt"}
        </span>
        <button
          class="switch ${device.on ? "on" : ""}"
          data-device="${device.id}"
          aria-label="Điều khiển ${device.name}">
          <span></span>
        </button>
      </div>
    </article>
  `;
}

function createRecentItem(record) {
  return `
    <div class="recent-item">
      <div class="recent-icon">⌁</div>
      <div>
        <strong>${escapeHTML(record.device)}</strong>
        <small>${escapeHTML(record.action)}</small>
      </div>
      <time>${escapeHTML(record.time)}</time>
    </div>
  `;
}

function toggleDevice(deviceId) {
  const device = devices.find(function (item) {
    return item.id === deviceId;
  });

  if (!device) return;

  device.on = !device.on;

  addHistory(
    device.name,
    device.on ? "Bật thiết bị" : "Tắt thiết bị"
  );

  renderDashboard();
}

function addHistory(device, action) {
  const now = new Date();

  const record = {
    id: "ACT-" + now.getTime() + "-" +
      Math.random().toString(36).slice(2, 6),
    device: device,
    action: action,
    source: "Website",
    date: formatDate(now),
    time: formatTime(now),
    status: "processing"
  };

  historyRecords.unshift(record);
  historyRecords = historyRecords.slice(0, 100);
  saveStorage(STORAGE.history, historyRecords);

  window.setTimeout(function () {
    historyRecords = historyRecords.map(function (item) {
      return item.id === record.id
        ? { ...item, status: "success" }
        : item;
    });

    saveStorage(STORAGE.history, historyRecords);

    if (currentPage === "history") {
      renderHistory();
    }
  }, 1800);
}

/* 6. Vẽ biểu đồ bằng Canvas, không cần thư viện ngoài */
function drawDashboardCharts() {
  const climateCanvas = document.getElementById("climate-chart");
  const lightCanvas = document.getElementById("light-chart");

  if (!climateCanvas || !lightCanvas) return;

  drawLineChart(climateCanvas, [
    {
      key: "temperature",
      label: "Nhiệt độ (°C)",
      color: "#ffad70",
      min: 15,
      max: 40
    },
    {
      key: "humidity",
      label: "Độ ẩm (%)",
      color: "#54c7f8",
      min: 0,
      max: 100
    }
  ]);

  drawLineChart(lightCanvas, [
    {
      key: "light",
      label: "Ánh sáng (ADC)",
      color: "#f5c66b",
      min: 0,
      max: 1023,
      convert: lightToADC
    }
  ]);

  const climateIndex = selectedChartPoints["climate-chart"];
  const lightIndex = selectedChartPoints["light-chart"];

  if (climateIndex !== undefined && sensorHistory[climateIndex]) {
    showChartPointDetails("climate-chart", sensorHistory[climateIndex], [
      {
        key: "temperature",
        label: "Nhiệt độ (°C)",
        color: "#ffad70"
      },
      {
        key: "humidity",
        label: "Độ ẩm (%)",
        color: "#54c7f8"
      }
    ]);
  }

  if (lightIndex !== undefined && sensorHistory[lightIndex]) {
    showChartPointDetails("light-chart", sensorHistory[lightIndex], [
      {
        key: "light",
        label: "Ánh sáng (ADC)",
        color: "#f5c66b",
        convert: lightToADC
      }
    ]);
  }
}

function drawLineChart(canvas, series) {
  const context = canvas.getContext("2d");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = window.devicePixelRatio || 1;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const padding = { left: 38, right: 15, top: 18, bottom: 28 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const points = sensorHistory;
  const selectedIndex = selectedChartPoints[canvas.id];

  context.clearRect(0, 0, width, height);
  context.font = "10px Segoe UI";
  context.strokeStyle = "#263852";
  context.fillStyle = "#91a2ba";
  context.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;

    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
  }

  series.forEach(function (item) {
    context.strokeStyle = item.color;
    context.lineWidth = 2.5;
    context.beginPath();

    points.forEach(function (point, index) {
      let value = point[item.key];

      if (item.convert) {
        value = item.convert(value);
      }

      const x = padding.left +
        (chartWidth / Math.max(points.length - 1, 1)) * index;

      const y = padding.top +
        chartHeight -
        ((value - item.min) / (item.max - item.min)) * chartHeight;

      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });

    context.stroke();

    points.forEach(function (point, index) {
      let value = point[item.key];

      if (item.convert) {
        value = item.convert(value);
      }

      const x = padding.left +
        (chartWidth / Math.max(points.length - 1, 1)) * index;

      const y = padding.top +
        chartHeight -
        ((value - item.min) / (item.max - item.min)) * chartHeight;

      context.beginPath();
      context.arc(
        x,
        y,
        index === selectedIndex ? 5 : 2.5,
        0,
        Math.PI * 2
      );
      context.fillStyle = item.color;
      context.fill();

      if (index === selectedIndex) {
        context.beginPath();
        context.arc(x, y, 8, 0, Math.PI * 2);
        context.strokeStyle = item.color;
        context.lineWidth = 1.5;
        context.stroke();
      }
    });
  });

  context.fillStyle = "#91a2ba";
  context.fillText("−30s", padding.left, height - 8);
  context.fillText("Hiện tại", width - 55, height - 8);

  series.forEach(function (item, index) {
    context.fillStyle = item.color;
    context.fillRect(padding.left + index * 120, 3, 8, 8);
    context.fillStyle = "#cbd6e6";
    context.fillText(item.label, padding.left + 13 + index * 120, 11);
  });

  canvas.onclick = function (event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const pointSpacing = chartWidth / Math.max(points.length - 1, 1);
    const rawIndex = Math.round(
      (clickX - padding.left) / pointSpacing
    );

    if (
      clickX < padding.left - 8 ||
      clickX > width - padding.right + 8 ||
      rawIndex < 0 ||
      rawIndex >= points.length
    ) {
      return;
    }

    selectedChartPoints[canvas.id] = rawIndex;
    showChartPointDetails(canvas.id, points[rawIndex], series);
    drawLineChart(canvas, series);
  };
}

function showChartPointDetails(canvasId, point, series) {
  const detailsId = canvasId === "climate-chart"
    ? "climate-point-details"
    : "light-point-details";

  const details = document.getElementById(detailsId);

  if (!details) return;

  const values = series.map(function (item) {
    let value = point[item.key];

    if (item.convert) {
      value = item.convert(value);
    }

    const digits = item.key === "temperature" ? 1 : 0;

    return `
      <span class="chart-detail-value">
        <i style="background:${item.color}"></i>
        ${item.label}: <strong>${Number(value).toFixed(digits)}</strong>
      </span>
    `;
  }).join("");

  details.innerHTML = `
    <span class="chart-detail-time">Thời điểm: ${escapeHTML(point.time)}</span>
    ${values}
  `;
}

function renderSensors() {
  const filteredRecords = getFilteredSensorRecords();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / sensorPageSize)
  );

  sensorPage = Math.min(sensorPage, totalPages);

  const start = (sensorPage - 1) * sensorPageSize;
  const pageRecords = filteredRecords.slice(start, start + sensorPageSize);

  document.getElementById("page-content").innerHTML = `
    <div class="page-heading">
      <div>
        <h1>Dữ liệu cảm biến</h1>
        <p>Lịch sử các lần ghi nhận dữ liệu mới nhất.</p>
      </div>
      <span class="count-pill">${filteredRecords.length} bản ghi</span>
    </div>

    <div class="panel">
      <div class="toolbar">
        <label>
          Lọc cảm biến
          <select id="sensor-type-filter">
            <option value="all">Tất cả cảm biến</option>
            <option value="Nhiệt độ">Nhiệt độ</option>
            <option value="Độ ẩm">Độ ẩm</option>
            <option value="Ánh sáng">Ánh sáng</option>
          </select>
        </label>

        <label class="search-field">
          Tìm kiếm theo giá trị
          <input
            id="sensor-value-search"
            type="text"
            placeholder="${getSensorPlaceholder()}">
        </label>

        <label>
          Lọc ngày và thời gian
          <input
            id="sensor-time-search"
            type="text"
            placeholder="dd/mm/yyyy hh:mm hoặc dd/mm/yyyy hh:mm:ss">
        </label>

        <button class="secondary-button" id="reset-sensor">
          Đặt lại
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>LOẠI CẢM BIẾN</th>
              <th>GIÁ TRỊ</th>
              <th>NGÀY VÀ THỜI GIAN</th>
            </tr>
          </thead>
          <tbody>
            ${pageRecords.map(function (record) {
              return `
                <tr>
                  <td class="id-text">${record.id}</td>
                  <td>${record.type}</td>
                  <td class="value-text">${record.value}</td>
                  <td>${record.time}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        ${filteredRecords.length === 0
          ? '<div class="empty-state">Không tìm thấy dữ liệu cảm biến phù hợp.</div>'
          : ""}
      </div>

      ${createPagination(
        sensorPage,
        totalPages,
        sensorPageSize,
        filteredRecords.length,
        "sensor"
      )}
    </div>
  `;

  document.getElementById("sensor-type-filter").value =
    sensorTypeFilter;

  document.getElementById("sensor-value-search").value =
    sensorValueSearch;

  document.getElementById("sensor-time-search").value =
    sensorTimeSearch;

  document.getElementById("sensor-type-filter")
    .addEventListener("change", function (event) {
      sensorTypeFilter = event.target.value;
      sensorPage = 1;
      updateSensorResults();
    });

  document.getElementById("sensor-value-search")
    .addEventListener("input", function (event) {
      sensorValueSearch = event.target.value;
      sensorPage = 1;
      updateSensorResults();
    });

  document.getElementById("sensor-time-search")
    .addEventListener("input", function (event) {
      sensorTimeSearch = event.target.value;
      sensorPage = 1;
      updateSensorResults();
    });

  document.getElementById("reset-sensor")
    .addEventListener("click", function () {
      sensorTypeFilter = "all";
      sensorValueSearch = "";
      sensorTimeSearch = "";
      sensorPage = 1;
      renderSensors();
    });

  attachPaginationEvents("sensor");
}

function updateSensorResults() {
  const filteredRecords = getFilteredSensorRecords();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / sensorPageSize)
  );

  sensorPage = Math.min(sensorPage, totalPages);

  const start = (sensorPage - 1) * sensorPageSize;
  const pageRecords = filteredRecords.slice(start, start + sensorPageSize);
  const tableBody = document.querySelector("#page-content tbody");
  const tableWrap = document.querySelector("#page-content .table-wrap");
  const countPill = document.querySelector("#page-content .count-pill");
  const pagination = document.querySelector("#page-content .pagination");

  if (!tableBody || !tableWrap || !countPill || !pagination) {
    return;
  }

  tableBody.innerHTML = pageRecords.map(function (record) {
    return `
      <tr>
        <td class="id-text">${escapeHTML(record.id)}</td>
        <td>${escapeHTML(record.type)}</td>
        <td class="value-text">${escapeHTML(record.value)}</td>
        <td>${escapeHTML(record.time)}</td>
      </tr>
    `;
  }).join("");

  let emptyState = tableWrap.querySelector(".empty-state");

  if (filteredRecords.length === 0) {
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      tableWrap.appendChild(emptyState);
    }

    emptyState.textContent =
      "Không tìm thấy dữ liệu cảm biến phù hợp.";
  } else if (emptyState) {
    emptyState.remove();
  }

  countPill.textContent = filteredRecords.length + " bản ghi";

  pagination.outerHTML = createPagination(
    sensorPage,
    totalPages,
    sensorPageSize,
    filteredRecords.length,
    "sensor"
  );

  attachPaginationEvents("sensor");
}

function getFilteredSensorRecords() {
  return sensorRecords.filter(function (record) {
    const matchesType = sensorTypeFilter === "all"
      || record.type === sensorTypeFilter;

    const matchesValue = record.value.toLowerCase()
      .includes(sensorValueSearch.trim().toLowerCase());

    const timeQuery = sensorTimeSearch.trim();
    const hasMinutes = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(timeQuery);
    const hasSeconds = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(timeQuery);

    const matchesTime = timeQuery === ""
      || ((hasMinutes || hasSeconds)
        && record.time.startsWith(timeQuery));

    return matchesType && matchesValue && matchesTime;
  });
}

function getSensorPlaceholder() {
  if (sensorTypeFilter === "Nhiệt độ") {
    return "Nhập nhiệt độ...";
  }

  if (sensorTypeFilter === "Độ ẩm") {
    return "Nhập độ ẩm...";
  }

  if (sensorTypeFilter === "Ánh sáng") {
    return "Nhập ánh sáng...";
  }

  return "Nhập nhiệt độ / nhập độ ẩm / nhập ánh sáng...";
}

/* 8. History Action */
function getFilteredHistoryRecords() {
  return historyRecords.filter(function (record) {
    const dateTime = record.date + " " + record.time;

    const matchesTime = dateTime.toLowerCase()
      .includes(historyTimeSearch.trim().toLowerCase());

    const matchesDevice = historyDeviceFilter === "all"
      || record.device === historyDeviceFilter;

    const matchesAction = historyActionFilter === "all"
      || record.action === historyActionFilter;

    const matchesStatus = historyStatusFilter === "all"
      || record.status === historyStatusFilter;

    return matchesTime && matchesDevice && matchesAction && matchesStatus;
  });
}

function updateHistoryResults() {
  const filteredRecords = getFilteredHistoryRecords();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / historyPageSize)
  );

  historyPage = Math.min(historyPage, totalPages);

  const start = (historyPage - 1) * historyPageSize;
  const pageRecords = filteredRecords.slice(start, start + historyPageSize);
  const tableBody = document.querySelector("#page-content tbody");
  const tableWrap = document.querySelector("#page-content .table-wrap");
  const countPill = document.querySelector("#page-content .count-pill");
  const pagination = document.querySelector("#page-content .pagination");

  if (!tableBody || !tableWrap || !countPill || !pagination) return;

  tableBody.innerHTML = pageRecords.map(function (record) {
    const statusLabels = {
      processing: "Đang xử lý",
      success: "Thành công",
      error: "Thất bại"
    };

    return `
      <tr>
        <td class="id-text">${escapeHTML(record.id)}</td>
        <td>${escapeHTML(record.device)}</td>
        <td>${escapeHTML(record.action)}</td>
        <td><span class="source-pill">${escapeHTML(record.source || "Website")}</span></td>
        <td>${escapeHTML(record.date)} · ${escapeHTML(record.time)}</td>
        <td>
          <span class="status-pill status-${record.status || "success"}">
            ${statusLabels[record.status] || "Thành công"}
          </span>
        </td>
      </tr>
    `;
  }).join("");

  let emptyState = tableWrap.querySelector(".empty-state");

  if (filteredRecords.length === 0) {
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      tableWrap.appendChild(emptyState);
    }
    emptyState.textContent = "Không tìm thấy lịch sử phù hợp.";
  } else if (emptyState) {
    emptyState.remove();
  }

  countPill.textContent =
    filteredRecords.length + "/" + historyRecords.length + " sự kiện";

  pagination.outerHTML = createPagination(
    historyPage,
    totalPages,
    historyPageSize,
    filteredRecords.length,
    "history"
  );

  attachPaginationEvents("history");
}

function renderHistory() {
  const filteredRecords = getFilteredHistoryRecords();

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / historyPageSize)
  );

  historyPage = Math.min(historyPage, totalPages);

  const start = (historyPage - 1) * historyPageSize;
  const pageRecords = filteredRecords.slice(start, start + historyPageSize);

  document.getElementById("page-content").innerHTML = `
    <div class="page-heading">
      <div>
        <h1>Lịch sử hoạt động</h1>
        <p>Lọc lịch sử theo thiết bị, hành động, trạng thái và thời gian.</p>
      </div>
      <span class="count-pill">
        ${filteredRecords.length}/${historyRecords.length} sự kiện
      </span>
    </div>

    <div class="panel">
      <div class="toolbar history-filter-toolbar">
        <label>
          Thiết bị
          <select id="history-device-filter">
            <option value="all">Tất cả thiết bị</option>
            <option value="Đèn">Đèn</option>
            <option value="Quạt">Quạt</option>
            <option value="Điều hòa">Điều hòa</option>
          </select>
        </label>

        <label>
          Hành động
          <select id="history-action-filter">
            <option value="all">Tất cả hành động</option>
            <option value="Bật thiết bị">Bật thiết bị</option>
            <option value="Tắt thiết bị">Tắt thiết bị</option>
          </select>
        </label>

        <label>
          Trạng thái
          <select id="history-status-filter">
            <option value="all">Tất cả trạng thái</option>
            <option value="processing">Đang xử lý</option>
            <option value="success">Thành công</option>
            <option value="error">Thất bại</option>
          </select>
        </label>

        <label class="search-field">
          Ngày và thời gian
          <input
            id="history-time-search"
            type="text"
            placeholder="Nhập ngày hoặc giờ...">
        </label>

        <button class="secondary-button" id="reset-history">
          Đặt lại
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>THIẾT BỊ</th>
              <th>HÀNH ĐỘNG</th>
              <th>NGUỒN</th>
              <th>NGÀY VÀ THỜI GIAN</th>
              <th>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            ${pageRecords.map(function (record) {
              const statusLabels = {
                processing: "Đang xử lý",
                success: "Thành công",
                error: "Thất bại"
              };

              return `
                <tr>
                  <td class="id-text">${escapeHTML(record.id)}</td>
                  <td>${escapeHTML(record.device)}</td>
                  <td>${escapeHTML(record.action)}</td>
                  <td><span class="source-pill">${escapeHTML(record.source || "Website")}</span></td>
                  <td>${escapeHTML(record.date)} · ${escapeHTML(record.time)}</td>
                  <td>
                    <span class="status-pill status-${record.status || "success"}">
                      ${statusLabels[record.status] || "Thành công"}
                    </span>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        ${filteredRecords.length === 0
          ? '<div class="empty-state">Không tìm thấy lịch sử phù hợp.</div>'
          : ""}
      </div>

      ${createPagination(
        historyPage,
        totalPages,
        historyPageSize,
        filteredRecords.length,
        "history"
      )}
    </div>
  `;

  document.getElementById("history-device-filter").value = historyDeviceDraft;
  document.getElementById("history-action-filter").value = historyActionDraft;
  document.getElementById("history-status-filter").value = historyStatusDraft;
  document.getElementById("history-time-search").value = historyTimeDraft;

  document.getElementById("history-device-filter")
    .addEventListener("change", function (event) {
      historyDeviceDraft = event.target.value;
      historyDeviceFilter = historyDeviceDraft;
      historyPage = 1;
      updateHistoryResults();
    });

  document.getElementById("history-action-filter")
    .addEventListener("change", function (event) {
      historyActionDraft = event.target.value;
      historyActionFilter = historyActionDraft;
      historyPage = 1;
      updateHistoryResults();
    });

  document.getElementById("history-status-filter")
    .addEventListener("change", function (event) {
      historyStatusDraft = event.target.value;
      historyStatusFilter = historyStatusDraft;
      historyPage = 1;
      updateHistoryResults();
    });

  document.getElementById("history-time-search")
    .addEventListener("input", function (event) {
      historyTimeDraft = event.target.value;
      historyTimeSearch = historyTimeDraft;
      historyPage = 1;
      updateHistoryResults();
    });

  document.getElementById("reset-history")
    .addEventListener("click", function () {
      historyDeviceDraft = "all";
      historyActionDraft = "all";
      historyStatusDraft = "all";
      historyTimeDraft = "";
      historyDeviceFilter = "all";
      historyActionFilter = "all";
      historyStatusFilter = "all";
      historyTimeSearch = "";
      historyPage = 1;
      renderHistory();
    });

  attachPaginationEvents("history");
}

/* 9. Thành phần phân trang dùng chung */
function createPagination(page, totalPages, pageSize, totalItems, type) {
  const firstItem = totalItems === 0
    ? 0
    : (page - 1) * pageSize + 1;

  const lastItem = Math.min(page * pageSize, totalItems);

  return `
    <div class="pagination">
      <div class="pagination-left">
        <span>Số dòng mỗi trang</span>
        <select data-page-size="${type}">
          <option value="5" ${pageSize === 5 ? "selected" : ""}>5</option>
          <option value="10" ${pageSize === 10 ? "selected" : ""}>10</option>
          <option value="20" ${pageSize === 20 ? "selected" : ""}>20</option>
        </select>
        <span>${firstItem}–${lastItem} / ${totalItems}</span>
      </div>

      <div class="pagination-actions">
        <button data-page-prev="${type}" ${page <= 1 ? "disabled" : ""}>
          Trước
        </button>
        <span>Trang ${page}/${totalPages}</span>
        <button
          data-page-next="${type}"
          ${page >= totalPages ? "disabled" : ""}>
          Sau
        </button>
      </div>
    </div>
  `;
}

function attachPaginationEvents(type) {
  const sizeSelect = document.querySelector(
    `[data-page-size="${type}"]`
  );

  sizeSelect.addEventListener("change", function () {
    if (type === "sensor") {
      sensorPageSize = Number(sizeSelect.value);
      sensorPage = 1;
      renderSensors();
    } else {
      historyPageSize = Number(sizeSelect.value);
      historyPage = 1;
      renderHistory();
    }
  });

  const previousButton = document.querySelector(
    `[data-page-prev="${type}"]`
  );

  const nextButton = document.querySelector(
    `[data-page-next="${type}"]`
  );

  previousButton.addEventListener("click", function () {
    if (type === "sensor") {
      sensorPage--;
      renderSensors();
    } else {
      historyPage--;
      renderHistory();
    }
  });

  nextButton.addEventListener("click", function () {
    if (type === "sensor") {
      sensorPage++;
      renderSensors();
    } else {
      historyPage++;
      renderHistory();
    }
  });
}

/* 10. Profile */
function renderProfile() {
  const studentId = currentUser.studentId || "B23DCAT019";

  document.getElementById("page-content").innerHTML = `
    <div class="page-heading">
      <div>
        <h1>Hồ sơ cá nhân</h1>
        <p>Thông tin tài khoản Smart House.</p>
      </div>
    </div>

    <div class="profile-grid">
      <div class="panel profile-card">
        <div class="profile-avatar">
          ${escapeHTML(currentUser.name.charAt(0))}
        </div>
        <h2>${escapeHTML(currentUser.name)}</h2>
        <p>${escapeHTML(currentUser.email)}</p>

        <div class="profile-meta">
          <span>Mã sinh viên</span>
          <strong>${escapeHTML(studentId)}</strong>
        </div>

        <div class="profile-meta">
          <span>Trạng thái</span>
          <strong style="color:var(--green)">Đang hoạt động</strong>
        </div>

        <button class="danger-button" id="profile-logout">
          Đăng xuất
        </button>
      </div>

      <div class="panel">
        <div class="panel-heading">
          <div>
            <h3>Thông tin tài khoản</h3>
            <p>Cập nhật tên hiển thị của bạn.</p>
          </div>
        </div>

        <form id="profile-form" class="profile-form">
          <label>
            Họ và tên
            <input
              name="name"
              value="${escapeHTML(currentUser.name)}"
              required>
          </label>

          <label>
            Mã sinh viên
            <input value="${escapeHTML(studentId)}" disabled>
          </label>

          <label>
            Địa chỉ email
            <input value="${escapeHTML(currentUser.email)}" disabled>
          </label>

          <button class="primary-button" type="submit">
            Lưu thay đổi
          </button>
          <div id="profile-message" class="notice"></div>
        </form>
      </div>
    </div>

    <section class="profile-resources">
      <div class="resource-strip">
        ${[
          { key: "figma", title: "Figma", icon: "🎨" },
          { key: "report", title: "Báo cáo PDF", icon: "📄" },
          { key: "github", title: "GitHub", icon: "💻" },
          { key: "swagger", title: "Swagger API", icon: "🔌" }
        ].map(function (resource) {
          const url = PROJECT_RESOURCES[resource.key];

          return url
            ? `<a class="resource-quick-link" href="${escapeHTML(url)}"
                 target="_blank" rel="noopener noreferrer">
                 <span>${resource.icon}</span>${resource.title}
               </a>`
            : `<span class="resource-quick-link is-pending">
                 <span>${resource.icon}</span>${resource.title}
               </span>`;
        }).join("")}
      </div>
    </section>
  `;

  document.getElementById("profile-form")
    .addEventListener("submit", updateProfile);

  document.getElementById("profile-logout")
    .addEventListener("click", logout);
}

function updateProfile(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const newName = formData.get("name").trim();

  if (newName.length < 2) return;

  currentUser.name = newName;

  users = users.map(function (user) {
    return user.id === currentUser.id ? currentUser : user;
  });

  saveStorage(STORAGE.users, users);
  saveStorage(STORAGE.session, currentUser);

  document.getElementById("profile-message").textContent =
    "Đã cập nhật thông tin tài khoản.";

  renderApp();
  currentPage = "profile";
  renderPage();
}

/* 11. Mô phỏng dữ liệu cảm biến */
function updateSensorData() {
  sensor.temperature = Math.max(
    20,
    Math.min(
      35,
      Number(
        (sensor.temperature + (Math.random() - 0.48) * 0.35)
          .toFixed(1)
      )
    )
  );

  sensor.humidity = Math.max(
    35,
    Math.min(
      85,
      Math.round(sensor.humidity + (Math.random() - 0.5) * 3)
    )
  );

  sensor.light = Math.max(
    5,
    Math.min(
      100,
      Math.round(sensor.light + (Math.random() - 0.5) * 7)
    )
  );

  const now = new Date();
  const timestamp = formatDateTime(now);
  const recordId = now.getTime();

  sensorRecords.unshift(
    {
      id: "TEMP-" + recordId,
      type: "Nhiệt độ",
      value: sensor.temperature.toFixed(1) + " °C",
      time: timestamp
    },
    {
      id: "HUM-" + recordId,
      type: "Độ ẩm",
      value: sensor.humidity + " %",
      time: timestamp
    },
    {
      id: "LIGHT-" + recordId,
      type: "Ánh sáng",
      value: lightToADC(sensor.light) + " ADC",
      time: timestamp
    }
  );

  sensorRecords = sensorRecords.slice(0, 150);

  sensorHistory.push({
    time: formatTime(now),
    temperature: sensor.temperature,
    humidity: sensor.humidity,
    light: sensor.light
  });

  if (sensorHistory.length > 20) {
    sensorHistory.shift();
  }

  if (currentPage === "dashboard") {
    renderDashboard();
  }

  if (currentPage === "sensors") {
    updateSensorResults();
  }
}

/* 12. Khởi chạy ứng dụng */
function startApp() {
  users = users.map(function (user) {
    if (
      user.email === "user@smarthouse.local"
      || user.name === "Demo User"
    ) {
      return {
        ...user,
        name: "Trần Đức Anh",
        studentId: "B23DCAT019",
        email: "anh@smarthouse.local"
      };
    }

    return user;
  });

  saveStorage(STORAGE.users, users);

  if (
    currentUser
    && (
      currentUser.email === "user@smarthouse.local"
      || currentUser.name === "Demo User"
    )
  ) {
    currentUser = {
      ...currentUser,
      name: "Trần Đức Anh",
      studentId: "B23DCAT019",
      email: "anh@smarthouse.local"
    };

    saveStorage(STORAGE.session, currentUser);
  }

  renderApp();

  window.addEventListener("resize", function () {
    if (currentPage === "dashboard") {
      drawDashboardCharts();
    }
  });

  window.setInterval(updateSensorData, 3000);
}

startApp();
