# VKU Study Room Booking App (React Native & Expo)
> **Mini-Project 2: Hệ thống Đặt phòng học & Phòng Lab thông minh theo thời gian thực dành cho sinh viên VKU (Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn)**

![VKU Study Room Banner](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80)

### 🔗 Links
- **🚀 Live Demo (GitHub Pages):** [https://nguyenthaison2408.github.io/RealtimeStudyRoomBookingApp/](https://nguyenthaison2408.github.io/RealtimeStudyRoomBookingApp/)
- **💻 GitHub Repository:** [https://github.com/nguyenthaison2408/RealtimeStudyRoomBookingApp](https://github.com/nguyenthaison2408/RealtimeStudyRoomBookingApp)

---

## 📖 1. Giới thiệu Dự án & Vấn đề giải quyết

Tại Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU), sinh viên và các nhóm nghiên cứu thường xuyên cần không gian để học nhóm, làm đồ án tốt nghiệp, thực hành vi mạch (IoT Lab), nghiên cứu AI/Robotics hoặc tổ chức seminar. Tuy nhiên, việc đến tận nơi để kiểm tra phòng trống thường gây mất thời gian, dễ xảy ra va chạm lịch (booking collision) hoặc không biết phòng có trang bị máy chiếu / PC đồ hoạ phù hợp hay không.

**VKU Study Space** là giải pháp ứng dụng di động đa nền tảng hiệu năng cao xây dựng bằng **React Native & Expo SDK**:
- Tra cứu danh sách phòng học, phòng Lab theo thời gian thực tại các **Toà A, Toà B, Toà C, Toà V**.
- Bộ lọc đa tiêu chí tức thời (Toà nhà, Sức chứa từ 2 đến >20 người, Trang thiết bị như Máy chiếu, Bảng viết, PC RTX, Máy lạnh).
- Khung giờ cố định 2 tiếng với **Conflict Engine** ngăn chặn trùng lịch tức thời.
- Cấp thẻ thông hành điện tử (Digital Booking Pass) kèm **Mã QR Check-in** tại cửa phòng (`react-native-qrcode-svg`).
- Hệ thống **Local Notification Reminders** tích hợp **`expo-notifications`** tự động nhắc nhở sinh viên 15 phút trước khi ca học bắt đầu.
- Quản lý phiên và lịch sử đặt phòng qua **Zustand** kết hợp lưu trữ cục bộ **`@react-native-async-storage/async-storage`**.

---

## 🛠 2. Kiến trúc & Công nghệ sử dụng

Ứng dụng được xây dựng theo kiến trúc **React Native & Expo Clean Architecture**:

| Thành phần | Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Framework nền tảng** | **Expo SDK 51** / React Native 0.74 | Chạy mượt mà trên cả điện thoại thật (Expo Go) và Web |
| **Language** | TypeScript (Strict Mode) | Đảm bảo an toàn kiểu dữ liệu 100%, tự động gợi ý code |
| **State Management** | Zustand (v5) | Quản lý trạng thái toàn cục gọn nhẹ, hiệu năng cao, zero boilerplate |
| **Offline Storage** | `@react-native-async-storage/async-storage` | Lưu trữ phiên làm việc của sinh viên và lịch sử đặt phòng ngoại tuyến |
| **Push / Local Alert** | `expo-notifications` + `expo-device` | Lập lịch thông báo nhắc nhở 15 phút trước giờ nhận phòng |
| **List Optimization** | Virtualized FlatList + `React.memo` | Đạt tốc độ cuộn mượt mà 60 FPS, tối ưu bộ nhớ DOM/Native |
| **Conflict Engine** | Rule-based Collision Detector | Ngăn chặn cùng lúc 2 nhóm đặt cùng phòng/giờ hoặc 1 sinh viên đặt 2 nơi |
| **QR Code Engine** | `react-native-qrcode-svg` + `qrcode.react` | Tạo mã quét độ nét cao không bị vỡ hạt trên cả Native & Web |
| **Bundler & Tooling** | Metro (Expo) + Vite (Web preview) | Tốc độ bundle siêu tốc và tương thích tuyệt đối |

---

## 📱 3. Hướng dẫn Cài đặt & Khởi chạy (Setup Instructions)

### Yêu cầu tiên quyết:
- **Node.js**: Phiên bản 18+ hoặc 20+ (Khuyên dùng v20.x hoặc v22.x)
- **Điện thoại di động**: Đã cài đặt ứng dụng **Expo Go** từ Google Play Store (Android) hoặc App Store (iOS).

### Các bước khởi chạy:
```bash
# 1. Di chuyển vào thư mục dự án
cd d:/AppDaNenTang

# 2. Cài đặt các gói phụ thuộc (nếu chưa cài)
npm install --legacy-peer-deps

# 3. Khởi chạy với Expo Metro Bundler (cho điện thoại Expo Go):
npx expo start
```
- **Trên Android / iOS**: Mở ứng dụng **Expo Go**, dùng camera quét mã QR xuất hiện trên màn hình terminal.
- **Phím tắt trong Expo Terminal**:
  - Bấm `a` để mở trình giả lập Android Emulator.
  - Bấm `i` để mở trình giả lập iOS Simulator.
  - Bấm `w` để mở giao diện Web trên trình duyệt.
  - Bấm `r` để reload lại ứng dụng.

### Khởi chạy bản Web nhanh (Vite):
```bash
npm run dev
# Mở trình duyệt tại: http://localhost:3000
```

### 🚀 Bản Web Live (GitHub Pages)
Ứng dụng được tự động build bằng Vite và triển khai lên GitHub Pages qua workflow `.github/workflows/deploy.yml` mỗi khi push lên nhánh `main`:

**👉 [https://nguyenthaison2408.github.io/RealtimeStudyRoomBookingApp/](https://nguyenthaison2408.github.io/RealtimeStudyRoomBookingApp/)**

> Lưu ý: Trong **Settings → Pages** của repo, mục **Build and deployment → Source** cần được đặt thành **GitHub Actions** để workflow deploy hoạt động.

---

## 📂 4. Cấu trúc Thư mục (Modular Architecture)

```
AppDaNenTang/
├── app.json                   # Cấu hình định danh & quyền Expo SDK
├── babel.config.js            # Cấu hình Babel với babel-preset-expo
├── metro.config.js            # Cấu hình Metro bundler
├── index.js                   # Điểm khởi chạy chính thức của Expo
├── package.json               # Cấu hình dự án & danh sách thư viện Expo
├── tsconfig.json              # Cấu hình TypeScript
├── README.md                  # Tài liệu hướng dẫn
├── REPORT.md                  # Báo cáo kỹ thuật tóm tắt (2-4 trang)
└── src/
    ├── types/
    │   ├── room.ts            # Type definitions cho Phòng, Toà nhà, Thiết bị
    │   └── booking.ts         # Type definitions cho Đặt chỗ, Ca học, UserSession
    ├── data/
    │   └── mockRooms.ts       # Dữ liệu mẫu 12+ phòng thực tế tại VKU
    ├── services/
    │   ├── conflictEngine.ts  # Thuật toán phát hiện & ngăn ngừa trùng lịch
    │   ├── notificationService.ts # Tích hợp expo-notifications nhắc lịch 15 phút
    │   └── storage.ts         # Persistence layer (@react-native-async-storage)
    ├── store/
    │   └── useBookingStore.ts # Zustand global store
    ├── components/
    │   ├── Header.tsx         # Top bar, Profile sinh viên & Tìm kiếm tức thời
    │   ├── FilterBar.tsx      # Chips lọc Toà nhà (A, B, C, V), Sức chứa, Tiện ích
    │   ├── RoomCard.tsx       # Component thẻ phòng Memoized (React.memo)
    │   ├── DateSelector.tsx   # Thanh chọn ngày 7 ngày tới
    │   ├── TimeSlotGrid.tsx   # Lưới ca học 2h kèm nhãn khoá xung đột
    │   ├── RoomDetailModal.tsx# Modal chi tiết, chọn ca & đặt chỗ
    │   ├── QRCodeAdapter.tsx  # Cross-platform QR Adapter (Native + Web)
    │   ├── QRCheckinModal.tsx # Thẻ thông hành VKU kèm mã QR & nút Check-in
    │   └── NotificationToast.tsx # Alert nhắc nhở trước 15 phút
    ├── screens/
    │   ├── HomeScreen.tsx     # Danh sách phòng (FlatList 60fps)
    │   ├── MyBookingsScreen.tsx # Quản lý lịch đã đặt & Huỷ phòng
    │   └── ProfileScreen.tsx  # Thông tin sinh viên & Bộ công cụ test
    └── App.tsx                # Giao diện chính tích hợp Tab Navigation
```

---

## ✅ 5. Bảng đối chiếu Yêu cầu Đồ án (Feature Checklist)

- [x] **Room Discovery & Multi-Parameter Filter**:
  - [x] Hiển thị ảnh phòng chất lượng cao, nhãn Toà/Tầng, sức chứa, trạng thái "Đang trống" vs "Đang có lớp".
  - [x] Tìm kiếm tức thì theo tên/mã phòng.
  - [x] Lọc theo toà nhà (A, B, C, V).
  - [x] Lọc theo sức chứa (2-5, 6-10, 10-20, >20 người).
  - [x] Lọc theo thiết bị (Máy chiếu, Bảng viết, PC RTX, Máy lạnh).
- [x] **60 FPS FlatList Optimization**:
  - [x] Memoized card components với `React.memo`.
  - [x] Cấu hình `getItemLayout`, `initialNumToRender={5}`, `windowSize={5}`, `maxToRenderPerBatch={5}`.
- [x] **Time-Slot Selector & Conflict Engine**:
  - [x] Chọn ngày trong 7 ngày tới.
  - [x] Ca học cố định 2 tiếng (07:30–09:30, 09:30–11:30, 13:00–15:00, 15:00–17:00, 17:30–19:30).
  - [x] Tự động khoá và hiển thị cảnh báo khi ca đã có người đặt trước.
  - [x] Ngăn chặn cùng 1 sinh viên đặt 2 phòng khác nhau trong cùng một khung giờ.
- [x] **Digital Pass & QR Check-in**:
  - [x] Tạo mã đặt phòng duy nhất dạng `VKU-BK-XXXXX`.
  - [x] Tích hợp `react-native-qrcode-svg` và `QRCodeSVG`.
  - [x] Nút mô phỏng Check-in tại cửa phòng và hiệu ứng chúc mừng (confetti).
- [x] **Global State Management (Zustand & AsyncStorage)**:
  - [x] Store `useBookingStore` quản lý phiên sinh viên, danh sách đặt chỗ, bộ lọc.
  - [x] Tích hợp `@react-native-async-storage/async-storage` lưu trữ ngoại tuyến.
- [x] **Local Notifications**:
  - [x] Tích hợp `expo-notifications` lập lịch cảnh báo nhắc check-in trước 15 phút đến giờ nhận phòng.
  - [x] In-app Notification banner kèm nút mở nhanh thẻ QR.
