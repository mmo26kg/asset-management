const { User } = require('../models');
const configService = require('../services/configService');
const userBalanceService = require('../services/userBalanceService');

// Hàm xử lý sau khi người dùng được đăng ký
exports.afterRegister = async (user) => {
    // ================= Hàm tạo cấu hình mặc định cho người dùng =================
    const createUserConfig = async () => {
        try {
            configService.createDefaultConfigByUser(user.id);
        } catch (error) {
            console.error('Lỗi khi tạo cấu hình mặc định cho người dùng:', user.id, error);
        }
    };

    // ================= Hàm tạo số dư ban đầu cho người dùng =================
    const createUserBalance = async () => {
        try {
            userBalanceService.createUserBalanceByUser(user.id);
        } catch (error) {
            console.error('Lỗi xảy ra khi tạo số dự mặc định cho người dùng: ', user.id, error);
        }

    };

    // ================= Gọi các xử lý sau đăng ký =================
    try {
        await createUserConfig();  // Tạo cấu hình mặc định
        await createUserBalance(); // Tạo số dư ban đầu
    } catch (error) {
        console.error('Lỗi khi xử lý sau đăng ký:', error.message);
    }
};

