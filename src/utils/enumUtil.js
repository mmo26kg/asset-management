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

