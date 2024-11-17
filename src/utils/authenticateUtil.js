const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const math = require('./mathUtil')
const dayjs = require('dayjs')

// Lấy KEY bí mật từ biến môi trường
const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

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
const generateToken = (payload, expiresIn = TOKEN_EXPIRATION) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};


// -----------------------------------------
// Hàm tiện ích: Lấy thông tin người dùng từ token
// -----------------------------------------

/**
 * Lấy thông tin người dùng từ token và xác thực.
 * @param {string} token - JWT token
 * @returns {Object} user - Thông tin người dùng
 * @throws {Error} Nếu token không hợp lệ hoặc người dùng không tồn tại
 */
const getUserFromToken = async (token) => {
    if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập.');
    }

    try {
        // Giải mã token
        console.log('Đang xác thực token:', token);
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token giải mã được:', decoded);
        checkTokenExpiration(token);

        // Lấy người dùng từ cơ sở dữ liệu
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new Error('Người dùng không tồn tại hoặc token không hợp lệ.');
        }

        return user;
    } catch (error) {
        console.log('Error during token verification:', error.message);
        throw new Error('Token không hợp lệ hoặc đã hết hạn.');
    }
};


const checkTokenExpiration = (token) => {
    // Giải mã token mà không cần kiểm tra chữ ký (decode)
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
        console.log('Token không hợp lệ hoặc không có thời gian hết hạn.');
        return;
    }

    // Lấy thời gian hết hạn (exp) từ token (số giây tính từ thời điểm Unix)
    const expirationTime = decoded.exp * 1000; // Chuyển từ giây sang mili giây

    // Lấy thời gian hiện tại (milliseconds)
    const currentTime = Date.now();

    // Tính thời gian còn lại
    const timeLeft = (expirationTime - currentTime)/1000/60; // phút

    if (timeLeft <= 0) {
        console.log('Token đã hết hạn.');
        return { isExpired: true, timeLeft: 0, expirationDate: null };
    } else {
        console.log(`Token còn lại ${math.roundToDecimal(timeLeft,1)} phút`);
        console.log(`Token còn lại ${math.roundToDecimal(timeLeft/60,2)} giờ`);
        console.log(`Token hết hạn vào: ${dayjs(expirationTime).format('DD/MM/YY HH:mm:ss')}`);    
    }
};


module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    getUserFromToken,
    checkTokenExpiration,
};