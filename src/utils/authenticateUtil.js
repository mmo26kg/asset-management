const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Lấy KEY bí mật từ biến môi trường
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Mã hóa mật khẩu
 * @param {string} password - Mật khẩu cần mã hóa
 * @returns {string} - Mật khẩu đã được mã hóa
 */
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

/**
 * So sánh mật khẩu
 * @param {string} password - Mật khẩu người dùng nhập
 * @param {string} hashedPassword - Mật khẩu đã mã hóa từ cơ sở dữ liệu
 * @returns {boolean} - Trả về true nếu mật khẩu khớp, false nếu không khớp
 */
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Tạo JWT Token
 * @param {Object} payload - Dữ liệu payload chứa thông tin người dùng
 * @param {string} expiresIn - Thời gian token hết hạn (ví dụ: '1h')
 * @returns {string} - JWT Token
 */
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken
};
