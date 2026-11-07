# Kỳ Đạo | Web Chơi Cờ Tướng 2 Người Chơi (Xiangqi Master)

Trang web chơi cờ tướng cá nhân hiện đại, thanh lịch với phong cách Đông phương truyền thống, được tối ưu hóa hoàn hảo để triển khai trên **Vercel**. Ứng dụng cung cấp đầy đủ luật cờ chuẩn quốc tế, chế độ 2 người chơi (cùng máy hoặc luyện cá nhân), ghi chép biên bản ván đấu, và giao diện 3D gỗ mộc cao cấp.

---

## 🌟 Tính Năng Nổi Bật

- **Giao diện Đông phương tuyệt mỹ**: 
  - Bàn cờ gỗ mộc vân tự nhiên, sông Sở Hà - Hán Giới (楚河 漢界), cung cấm và các điểm dấu sao pháo/tốt chuẩn xác.
  - Quân cờ 3D khắc chìm chữ thư pháp (帅/将, 仕/士, 相/象, 傌/马, 俥/车, 炮/砲, 兵/卒) với ánh sáng nổi và bóng đổ chân thực.
  - 3 phong cách quân cờ: **Gỗ Mộc Cổ Điển**, **Hoàng Gia Ngọc Bích**, **Hắc Kim Hiện Đại**.
- **Luật Cờ Tướng Chuẩn Quốc Tế**:
  - Kiểm tra nước đi hợp lệ đầy đủ cho 7 loại quân.
  - Bắt buộc tuân thủ luật cản mắt Tượng, chẹn chân Mã, cung cấm Tướng/Sĩ, súng đại bác ăn quân qua ngòi.
  - Luật Tướng đối mặt (Phi Tướng / Flying General) bị cấm tuyệt đối.
  - Phát hiện Chiếu Tướng (Check), Chiếu Bí (Checkmate), Hết Nước Đi (Stalemate) tự động.
- **Biên Bản Ván Đấu Chuẩn Tiếng Việt**:
  - Ghi nhận chi tiết từng nước cờ theo quy chuẩn cờ tướng Việt Nam (ví dụ: *Pháo 2 bình 5*, *Mã 8 tiến 7*, *Xe 1 tiến 2*).
  - Hỗ trợ bấm vào bất kỳ nước cờ nào trong quá khứ để xem lại thế trận (History Scrubbing).
  - Nút "Sao chép" biên bản ván đấu với 1 cú click.
- **Công Cụ Luyện Cờ Chuyên Sâu**:
  - **Hoàn Tác (Undo)** & **Đi Tiếp (Redo)**: Rút lại nước đi bất kỳ lúc nào để thử nghiệm nhiều phương án.
  - **Chế độ Luyện Tự Do (Sandbox)**: Tắt lượt đi luân phiên để tự do di chuyển quân của cả hai bên theo ý muốn, thuận tiện xếp trận và phân tích tàn cuộc.
  - **Xoay Bàn Cờ (Flip Board)**: Đổi góc nhìn giữa bên Đỏ và bên Đen, hoặc bật chế độ tự động xoay khi đổi lượt.
- **Âm Thanh Chân Thực (Web Audio API)**:
  - Hiệu ứng gõ cờ lách cách chân thực, âm ăn quân trầm vang, chuông đồng cảnh báo khi Chiếu Tướng, pháo hoa ăn mừng khi thắng trận.
  - Không phụ thuộc file âm thanh ngoài, chạy mượt mà ngay cả khi offline.
- **Đồng Hồ Thi Đấu Tùy Chỉnh**:
  - Chơi không giới hạn thời gian hoặc hẹn giờ 10 phút, 15 phút, 20 phút.

---

## 🚀 Hướng Dẫn Deploy Lên Vercel (Miễn Phí 100%)

Dự án đã được tích hợp sẵn file cấu hình `vercel.json` chuẩn dành cho Vite/React SPA. Bạn có 2 cách cực kỳ nhanh để đưa trang web lên Vercel:

### Cách 1: Đẩy code lên GitHub rồi kết nối Vercel (Khuyên dùng)
1. Tạo một repository mới trên tài khoản [GitHub](https://github.com/new) của bạn (ví dụ đặt tên: `co-tuong-web`).
2. Mở terminal tại thư mục dự án và chạy các lệnh:
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/co-tuong-web.git
   git push -u origin main
   ```
3. Truy cập [vercel.com](https://vercel.com), đăng nhập bằng GitHub.
4. Bấm **"Add New..."** -> **"Project"** -> Chọn repository `co-tuong-web` vừa đẩy lên.
5. Vercel sẽ tự động nhận diện framework **Vite**, bạn chỉ cần bấm **Deploy**.
6. Sau khoảng 30 giây, bạn sẽ nhận được một đường link public (ví dụ: `https://co-tuong-web.vercel.app`) để truy cập trên điện thoại và máy tính bất kỳ lúc nào!

### Cách 2: Deploy trực tiếp qua Vercel CLI
Nếu bạn đã cài sẵn Vercel CLI:
```bash
npx vercel
```
Làm theo các bước hướng dẫn trên màn hình và chọn tài khoản của bạn để deploy ngay lập tức.

---

## 💻 Chạy Thử Trên Máy Tính (Local Development)

```bash
# Cài đặt dependencies (nếu chưa cài)
npm install

# Khởi chạy server phát triển
npm run dev

# Kiểm tra build sản phẩm
npm run build
```
Truy cập: `http://localhost:5173` trên trình duyệt.
