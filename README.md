# Charity Donation Front End

## Mô tả

Hệ thống đóng góp từ thiện vùng thiên tai, cho phép người dùng đóng góp và quản lý quyên góp cho các nạn nhân bị ảnh hưởng bởi thiên tai. Hệ thống hỗ trợ nhiều phương thức thanh toán, bao gồm tiền mặt, chuyển khoản ngân hàng, ví điện tử và thẻ tín dụng.

## Tính năng

- Đăng ký người dùng và xác minh qua OTP.
- Đóng góp từ thiện qua nhiều phương thức.
- Quản lý chiến dịch cứu trợ.
- Phản hồi và đánh giá từ người dùng.
- Theo dõi và báo cáo về các khoản quyên góp.

## Công nghệ sử dụng

- Node.js
- ReactJs
- Tailwind CSS
- Twilio for OTP
- html2canvas-pro for Export PDF

## Hướng dẫn cài đặt

- npm install

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.14.0)

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Rebuild tailwind css

npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
