// -----------------------------------------
// Import thư viện và cấu hình môi trường
// -----------------------------------------
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

// Lấy KEY bí mật từ biến môi trường
const SECRET_KEY = process.env.SECRET_KEY;

// -----------------------------------------
// Middleware kiểm tra người dùng đã login hay chưa
// -----------------------------------------

/**
 * Middleware xác thực người dùng (kiểm tra token trong header)
 * Xác nhận người dùng đã đăng nhập và token hợp lệ
 */
const checkLogin = async (req, res, next) => {
    // Lấy token từ header Authorization (format: "Bearer <token>")
    const token = req.headers['authorization']?.split(' ')[1]; 

    // Kiểm tra xem token có tồn tại không
    if (!token) {
        return res.status(401).json({ error: 'Chưa có token. Vui lòng đăng nhập.' });
    }

    try {
        // Giải mã token để lấy thông tin người dùng
        const decoded = jwt.verify(token, SECRET_KEY);

        // Kiểm tra người dùng có tồn tại trong DB hay không
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Token không hợp lệ. Người dùng không tồn tại.' });
        }

        // Gán thông tin người dùng vào request để các middleware hoặc controller sau có thể sử dụng
        req.user = user;

        // Tiếp tục xử lý request
        next();
    } catch (error) {
        // Nếu token không hợp lệ hoặc hết hạn
        return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' });
    }
};

// -----------------------------------------
// Export middleware để sử dụng ở nơi khác trong ứng dụng
// -----------------------------------------
module.exports = {
    checkLogin,
};
