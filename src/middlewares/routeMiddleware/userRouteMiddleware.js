// Import Enum và các module cần thiết
const enums = require('../../utils/enumUtil');
const { User } = require('../../models');
require('dotenv').config();

// Middleware kiểm tra dữ liệu trước khi đăng ký người dùng
module.exports.beforeRegister = async (req, res, next) => {

    // ================= Kiểm tra giá trị "membership" =================
    const isMembershipValid = Object.values(enums.Memberships)
                                     .map(membership => membership.value) // Lấy giá trị của membership từ Enum
                                     .includes(req.body.membership);      // Kiểm tra nếu giá trị của membership trong request hợp lệ

    if (!isMembershipValid) {
        return res.status(400).json({
            error: 'Giá trị membership không hợp lệ.',
            valid_options: Object.values(enums.Memberships), // Trả về các giá trị hợp lệ của membership
        });
    }

    // ================= Kiểm tra giá trị "role" =================
    const isRoleValid = Object.values(enums.Roles)
                              .map(role => role.value) // Lấy giá trị của role từ Enum
                              .includes(req.body.role); // Kiểm tra nếu giá trị của role trong request hợp lệ

    if (!isRoleValid) {
        return res.status(400).json({
            error: 'Giá trị role không hợp lệ.',
            valid_options: Object.values(enums.Roles), // Trả về các giá trị hợp lệ của role
        });
    }

    // ================= Kiểm tra sự tồn tại của tên người dùng =================
    const existingUser = await User.findOne({ where: { username: req.body.username } });
    if (existingUser) {
        return res.status(400).json({
            error: `Tên đăng nhập "${req.body.username}" đã tồn tại. Vui lòng chọn tên khác.`
        });
    }

    // ================= Kiểm tra quyền tạo tài khoản với vai trò "system_admin" =================
    const canCreateSysAdmin = req.body.secret === process.env.CREAT_SYSTEM_ADMIN_KEY;
    if (req.body.role === 'system_admin' && !canCreateSysAdmin) {
        return res.status(400).json({
            error: 'Bạn không có quyền tạo tài khoản với vai trò "system_admin".'
        });
    }

    // ================= Nếu tất cả đều hợp lệ, tiếp tục xử lý request =================
    next();
};
