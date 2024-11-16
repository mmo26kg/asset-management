const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

// Lấy KEY bí mật từ biến môi trường
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware xác thực người dùng
 * Kiểm tra JWT token trong header và xác thực người dùng
 */
const authenticateUser = async (req, res, next) => {
    // Lấy token từ header Authorization (Bearer token)
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token sau "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'Token không có hoặc không hợp lệ. Vui lòng đăng nhập lại và thử lại' });
    }

    try {
        // Giải mã token và lấy thông tin người dùng
        const decoded = jwt.verify(token, SECRET_KEY);

        // Lưu thông tin người dùng vào req.user
        req.user = decoded;

        // Tiếp tục đến bước tiếp theo (route handler)
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại và thử lại' });
    }
};

/**
 * Middleware kiểm tra quyền truy cập của người dùng
 * Kiểm tra xem người dùng có quyền truy cập vào route hiện tại không
 */
const authorizeUser = (requiredRole = 'user') => {
    return async (req, res, next) => {
        // Kiểm tra xem người dùng đã xác thực chưa
        if (!req.user) {
            return res.status(401).json({ message: 'Vui lòng đăng nhập để truy cập' });
        }

        // Lấy thông tin người dùng từ database
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Kiểm tra quyền truy cập (role)
        if (user.role !== requiredRole) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        // Nếu người dùng có quyền, tiếp tục
        next();
    };
};

module.exports = {
    authenticateUser,
    authorizeUser,
};
