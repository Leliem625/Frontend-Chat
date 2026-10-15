# Frontend Chat (React + Vite)

Giao diện web cho ứng dụng chat, kết nối với backend `Backend-Chat` qua REST API và socket.io.

## Chạy dự án

1. Cài thư viện

   ```bash
   npm install
   ```

2. Tạo file `.env` từ `.env.example` và sửa địa chỉ backend

   ```bash
   cp .env.example .env
   ```

3. Chạy dev server rồi mở http://localhost:8082

   ```bash
   npm run dev
   ```

## Lệnh khác

```bash
npm run build      # build bản production vào thư mục dist/
npm run preview    # chạy thử bản build
npm run lint       # kiểm tra code
npm run typecheck  # kiểm tra kiểu TypeScript
```

## Cấu trúc

```
src/
  router.tsx     # khai báo các đường dẫn (React Router)
  layouts/       # khung trang, thanh tab, chặn trang khi chưa đăng nhập
  pages/         # mỗi file là 1 trang
  components/    # các thành phần giao diện
  api/           # gọi REST API backend
  socket/        # kết nối socket.io, danh sách người online
  context/       # trạng thái đăng nhập (AuthProvider)
```
