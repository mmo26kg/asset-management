// Import dependencies
const { User } = require('../models');
const utils = require('../utils/authenticateUtil');
const deleteUtil = require('../utils/deleteUtil');
const userHook = require('../hooks/userHook');

/**
 * Service: Quản lý người dùng (User Service)
 * Các hàm phục vụ CRUD và xác thực người dùng
 */

// ============================
// *** CRUD Operations ***
    
/**
 * Lấy tất cả người dùng dựa trên các điều kiện tìm kiếm
 * @param {Object} queryConditions - Các điều kiện tìm kiếm
 */
exports.getAllUsers = async (queryConditions, listOptions) => {

    const result = await User.findAndCountAll({
        where: {
            ...queryConditions,
            ...listOptions.whereCondition,
        },
        order: [[listOptions.sortBy, listOptions.sortOrder]],
        limit: listOptions.perpage,
        offset: listOptions.offset,
    });




    return {
        totalResults: result.count,
        totalPages: Math.ceil(result.count / listOptions.perpage),
        currentPage: listOptions.page,
        perPage: listOptions.perpage,
        data: result.rows,
    };
};

/**
 * Lấy một người dùng theo ID
 * @param {number} id - ID người dùng
 */
exports.getUserById = async (id) => {
    return await User.findByPk(id);
};

/**
 * Tạo mới một người dùng
 * @param {Object} data - Thông tin người dùng
 */
exports.createUser = async (data) => {
    return await User.create(data);
};

/**
 * Cập nhật thông tin người dùng theo ID
 * @param {number} id - ID người dùng
 * @param {Object} data - Dữ liệu mới để cập nhật
 */
exports.updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(data);
    return user;
};

/**
 * Xóa một người dùng theo ID
 * @param {number} id - ID người dùng
 */

exports.deleteUser = async (id, option, checkDetail) => {
    const constraints = deleteUtil.UserDeleteConstraint;
    return await deleteUtil.deleteService(User, id, constraints, option, checkDetail);
};



// ============================
// *** Authentication Operations ***

/**
 * Đăng ký người dùng mới
 * @param {Object} data - Dữ liệu người dùng bao gồm tên và mật khẩu
 */
exports.registerUser = async (data) => {

    const { password, ...userData } = data;

    // Mã hóa mật khẩu bằng hàm tiện ích
    const hashedPassword = await utils.hashPassword(password);

    // Tạo mới người dùng với mật khẩu đã mã hóa
    const user = await User.create({ ...userData, password: hashedPassword });

    // Chuẩn bị payload cho token (loại bỏ password)
    const payload = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
    };

    // Tạo token bằng hàm tiện ích
    const token = utils.generateToken(payload);

    // Loại bỏ mật khẩu khỏi kết quả trả về
    const userWithoutPassword = user.get({ plain: true });
    delete userWithoutPassword.password;

    userHook.afterRegister(userWithoutPassword);

    return {
        user: userWithoutPassword,
        token,
    };
};

/**
 * Đăng nhập người dùng
 * @param {Object} credentials - Thông tin đăng nhập (username, password)
 */
exports.loginUser = async (credentials) => {
    const { username, password } = credentials;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ where: { username } });
    if (!user) {
        throw new Error('Người dùng không tồn tại, vui lòng nhập lại tên tài khoản chính xác');
    }

    // So sánh mật khẩu bằng hàm tiện ích
    const isPasswordValid = await utils.comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Sai mật khẩu, vui lòng thử lại');
    }

    // Chuẩn bị payload cho token (loại bỏ password)
    const payload = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
    };

    // Tạo token bằng hàm tiện íchv
    const token = utils.generateToken(payload);
    utils.checkTokenExpiration(token);

    // Loại bỏ mật khẩu khỏi kết quả trả về
    const userWithoutPassword = user.get({ plain: true });
    delete userWithoutPassword.password;

    return {
        user: userWithoutPassword,
        token,
    };
};
