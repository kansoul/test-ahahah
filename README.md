# SetKeo Project

Đây là dự án SetKeo sử dụng Express và MongoDB để xây dựng một ứng dụng web.

## Cài đặt

1. Clone repository:

```
git clone git@github.com:phamtu613/set-keo-backend.git
```

2. Cài đặt dependencies:

```
npm install
```

3. Sao chép file `.env.default` thành `.env` và cung cấp các giá trị cần thiết.

```
cp .env.default .env
```

4. Khởi động server:

```
npm run dev
```

## Cấu trúc thư mục

- **/routes**: Chứa các file định tuyến cho ứng dụng.
- **/constants**: Chứa các file định nghĩa biến cho ứng dụng.
- **/models**: Chứa các mô hình dữ liệu MongoDB.
- **/controllers**: Chứa các logic xử lý cho các tác vụ cụ thể.
- **/config**: Chứa cấu hình ứng dụng, như kết nối với cơ sở dữ liệu.
- **/middlewares**: Chứa các middleware Express tùy chỉnh.
- **/types**: Chứa các type tùy chỉnh.
- **/utils**: Chứa các hàm tùy chỉnh.

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng tạo một pull request trên GitHub.

## Liên hệ

Nếu có bất kỳ thắc mắc hoặc đề xuất nào, hãy liên hệ với chúng tôi qua email: example@example.com
