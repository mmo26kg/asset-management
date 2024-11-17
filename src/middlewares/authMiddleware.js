// -----------------------------------------
// Import thư viện và cấu hình môi trường
// -----------------------------------------
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');
const utils = require('../utils/authenticateUtil');

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
    try {
        // Lấy token từ header Authorization (format: "Bearer <token>")
        const token = req.headers['authorization']?.split(' ')[1];

        // Lấy thông tin người dùng từ token
        const user = await utils.getUserFromToken(token);

        // Gán thông tin người dùng vào request để các middleware hoặc controller sau có thể sử dụng
        req.user = user;

        // Tiếp tục xử lý request
        next();
    } catch (error) {
        // Trả về lỗi nếu token không hợp lệ hoặc hết hạn
        return res.status(401).json({
            error: error.message,
        });
    }
};

// -----------------------------------------
// Middleware kiểm tra quyền system_admin
// -----------------------------------------

/**
 * Middleware kiểm tra quyền system_admin
 * Xác nhận người dùng có vai trò `system_admin` để thực hiện các thao tác đặc biệt
 */
const checkSystemAdmin = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization (format: "Bearer <token>")
        const token = req.headers['authorization']?.split(' ')[1];
        console.log('Token received:', token);

        // Lấy thông tin người dùng từ token
        const user = await utils.getUserFromToken(token);

        // Kiểm tra vai trò của người dùng
        if (user.role !== 'system_admin') {
            return res.status(403).json({
                error: 'Bạn không có quyền truy cập. Chỉ dành cho quản trị viên.',
            });
        }

        // Gán thông tin người dùng vào request để sử dụng sau (nếu cần)
        req.user = user;

        // Tiếp tục xử lý request
        next();
    } catch (error) {
        // Trả về lỗi nếu token không hợp lệ hoặc hết hạn
        return res.status(401).json({
            error: error.message,
        });
    }
};


/**
 * Middleware kiểm tra quyền sở hữu.
 * @param {Model} model - Sequelize model của tài nguyên cần kiểm tra quyền sở hữu.
 * @param {string} ownerField - Tên trường lưu ID của chủ sở hữu (mặc định là 'ownerId').
 */
const checkOwner = (model, ownerField = 'userId') => {
    return async (req, res, next) => {
        try {
            // Lấy token từ header Authorization
            const token = req.headers['authorization']?.split(' ')[1];

            // Xác thực và lấy thông tin người dùng từ token
            const user = await utils.getUserFromToken(token);
            // console.log('Decoded user from token:', user);

            // Lấy ID của tài nguyên từ tham số URL
            const resourceId = req.params.id;
            // console.log('Resource ID from params:', resourceId);

            // Tìm tài nguyên trong cơ sở dữ liệu
            const resource = await model.findByPk(resourceId);
            // console.log('Resource fetched from DB:', resource);

            // Kiểm tra tài nguyên có tồn tại hay không
            if (!resource) {
                return res.status(404).json({ error: 'Tài nguyên không tồn tại.' });
            }

            // Kiểm tra quyền sở hữu
            if (resource[ownerField] !== user.id && user.role !== 'system_admin') {
                return res.status(403).json({ error: 'Bạn không có quyền truy cập tài nguyên này.' });
            }

            // Gắn thông tin người dùng và tài nguyên vào request
            req.user = user;
            req.resource = resource;

            // Tiếp tục xử lý request
            next();
        } catch (error) {
            // console.log('Error in checkOwner middleware:', error);
            return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' });
        }
    };
};

// -----------------------------------------
// Export các middleware
// -----------------------------------------
module.exports = {
    checkLogin,
    checkSystemAdmin,
    checkOwner,
};