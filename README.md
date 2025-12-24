# KaraApp - Hệ Thống Karaoke Thông Minh Thế Hệ Mới

KaraApp là một giải pháp Karaoke hiện đại, cho phép bạn biến bất kỳ chiếc TV, máy tính hoặc máy tính bảng nào thành một đầu máy Karaoke chuyên nghiệp. Với khả năng điều khiển từ xa qua điện thoại thông minh, KaraApp mang đến trải nghiệm hát Karaoke mượt mà, không quảng cáo và cực kỳ dễ sử dụng.

---

## Tính Năng Nổi Bật

*   **Màn Hình TV (Display System):** Giao diện hát chuyên nghiệp, hỗ trợ video chất lượng cao từ YouTube, hiển thị hàng chờ và thông báo bài tiếp theo.
*   **Điều Khiển Từ Xa (Remote Control):** Chỉ cần quét mã hoặc nhập IP, điện thoại của bạn sẽ trở thành chiếc remote thông minh để tìm bài, ưu tiên bài hát, và điều khiển nhạc (Play/Pause/Skip/Seek).
*   **Kết Nối Tức Thì (Real-time):** Sử dụng Socket.IO giúp mọi thao tác trên điện thoại được thực thi ngay lập tức trên màn hình TV mà không có độ trễ.
*   **Quản Lý Hàng Chờ (Smart Queue):** Thêm bài, xóa bài, thay đổi thứ tự ưu tiên bài hát một cách linh hoạt.
*   **Giao Diện Premium:** Thiết kế theo phong cách Glassmorphism hiện đại, hỗ trợ Dark Mode và tối ưu hoàn hảo cho cả iPad (ngang/dọc) và Mobile.
*   **Hỗ Trợ PWA:** Có thể cài đặt trực tiếp vào màn hình chính điện thoại như một ứng dụng thực thụ.

---

## Công Nghệ Sử Dụng

*   **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router), React 19.
*   **Real-time:** [Socket.io](https://socket.io/).
*   **Backend:** Node.js, Express.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/).
*   **Icons:** [Lucide React](https://lucide.dev/).
*   **Styling:** CSS hiện đại, tối ưu responsive đa thiết bị.

---

## Hướng Dẫn Cài Đặt và Chạy Local

### 1. Chuẩn bị
Máy tính của bạn cần có [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Chạy ứng dụng
```bash
npm run dev
```
Hệ thống sẽ khởi động tại địa chỉ: `http://localhost:3000`

---

## Cách Sử Dụng Trong Mạng Nội Bộ (Wi-Fi)

Để hát cùng gia đình và bạn bè qua điện thoại:

1.  **Mở TV/Máy tính:** Truy cập vào địa chỉ IP của máy tính (Ví dụ: `http://192.168.1.5:3000`) và chọn **"Hát Trên TV"**.
2.  **Kết nối Điện thoại:** Dùng điện thoại truy cập cùng địa chỉ IP đó, chọn **"Dùng Điện Thoại"**.
3.  **Nhập Mã:** Nhập mã 6 chữ số đang hiển thị trên màn hình TV vào điện thoại của bạn.
4.  **Bắt đầu hát:** Tìm kiếm bài hát yêu thích trên điện thoại và nhấn (+) để thêm vào danh sách.

---

## Deploy (Triển Khai)

Dự án đã được cấu hình server hợp nhất (`server.js`), cho phép bạn dễ dàng deploy lên các nền tảng như:
*   **Railway.app / Render / DigitalOcean:** Hỗ trợ tốt cho kết nối Socket.IO.
*   **Vercel:** Yêu cầu một số cấu hình bổ sung cho Socket (hoặc sử dụng cơ chế Polling).

---

## Giấy Phép
Dự án được phát triển nhằm mục đích giải trí và học tập.

---

**Cùng KaraApp, mang cả phòng Karaoke về nhà bạn!**
