// utils/enumUtil.js
module.exports.Roles = {
    MEMBER: { value: 'member', description: 'Standard user role', translate: 'Thành viên' },
    ADMIN: { value: 'admin', description: 'Administrator role', translate: 'Quản trị viên' },
    BOSS: { value: 'boss', description: 'Top-level management', translate: 'Giám đốc' },
    SYSTEM_ADMIN: { value: 'system_admin', description: 'System administrator role', translate: 'Quản trị hệ thống' }
};

module.exports.Memberships = {
    BASIC: { value: 'basic', description: 'Basic membership', translate: 'Cơ bản' },
    PREMIUM: { value: 'premium', description: 'Premium membership', translate: 'Ưu tiên' },
    VIP: { value: 'vip', description: 'VIP membership', translate: 'VIP' }
};
module.exports.TransactionTypes = {
    OPEN: {
        value: 'open',
        description: 'Open balance transaction', // Giao dịch mở đầu số dư 
        translate: 'Số dư mở tài khoản'
    },
    INC: {
        value: 'increase',
        description: 'Increase transaction', // Giao dịch tăng số dư
        translate: 'Giao dịch tăng'
    },
    DEC: {
        value: 'decrease',
        description: 'Decrease transaction', // Giao dịch giảm số dư
        translate: 'Giao dịch giảm'
    },
    ADJ: {
        value: 'adjust',
        description: 'Adjustment transaction', // Giao dịch điều chỉnh số dư
        translate: 'Điều chỉnh'
    }
};



