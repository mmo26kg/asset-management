const modelNames = {
    User: {
        vi: {
            capitalize: 'Người Dùng',
            upper: 'NGƯỜI DÙNG',
            normalize: 'người dùng',
        },
        en: {
            capitalize: 'User',
            upper: 'USER',
            normalize: 'user',
        },
        alias: ['nguoidung', 'user'], // Các tên gọi khác của model
        description: 'Đại diện cho người sử dụng hệ thống.', // Mô tả ngắn gọn
    },
    Transaction: {
        vi: {
            capitalize: 'Giao Dịch',
            upper: 'GIAO DỊCH',
            normalize: 'giao dịch',
        },
        en: {
            capitalize: 'Transaction',
            upper: 'TRANSACTION',
            normalize: 'transaction',
        },
        alias: ['giaodich', 'transaction'],
        description: 'Đại diện cho các giao dịch tài chính của người dùng.',
    },
    Category: {
        vi: {
            capitalize: 'Danh Mục',
            upper: 'DANH MỤC',
            normalize: 'danh mục',
        },
        en: {
            capitalize: 'Category',
            upper: 'CATEGORY',
            normalize: 'category',
        },
        alias: ['danhmuc', 'category'],
        description: 'Nhóm các giao dịch hoặc tài sản theo loại.',
    },
    Account: {
        vi: {
            capitalize: 'Tài Khoản',
            upper: 'TÀI KHOẢN',
            normalize: 'tài khoản',
        },
        en: {
            capitalize: 'Account',
            upper: 'ACCOUNT',
            normalize: 'account',
        },
        alias: ['taikhoan', 'account'],
        description: 'Thông tin về tài khoản người dùng.',
    },
    // Thêm các model khác
};

/**
 * Hàm lấy tên model theo ngôn ngữ và kiểu định dạng
 * @param {string} modelKey - Tên khóa của model (ví dụ: 'User')
 * @param {string} format - Định dạng cần lấy (capitalize, upper, normalize)
 * @param {string} lang - Ngôn ngữ ('vi', 'en', ...)
 * @returns {string} Tên của model theo định dạng và ngôn ngữ
 */
const getModelName = (modelKey, format, lang = 'vi') => {
    const model = modelNames[modelKey];
    if (!model) return null; // Trả về null nếu model không tồn tại
    return model[lang]?.[format] || null; // Trả về tên theo format và ngôn ngữ
};

/**
 * Lấy alias của một model
 * @param {string} modelKey - Tên khóa của model (ví dụ: 'User')
 * @returns {Array<string>} Danh sách alias hoặc null nếu không có
 */
const getModelAlias = (modelKey) => {
    const model = modelNames[modelKey];
    return model?.alias || null;
};

module.exports = {
    modelNames,
    getModelName,
    getModelAlias,
};
