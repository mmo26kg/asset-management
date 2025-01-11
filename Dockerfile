# Sử dụng Node.js LTS làm image cơ bản
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --production

# Sao chép mã nguồn ứng dụng
COPY . .

# Mở cổng
EXPOSE 8080

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
