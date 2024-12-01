const { User } = require('../models');
const configService = require('../services/configService');
const userBalanceService = require('../services/userBalanceService');
const mailUtil = require('../utils/mailUtil');
const emailtemplate = require('../emailTemplate/welcomeUserRegister'); // Import dayjs



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


    // ================= Gửi email chào mừng =================
    const sendWelcomeEmail = async () => {

        const emailDetails = emailtemplate.welcomeUserRegister(user);
        try {
            const emailOptions = {
                receiverInfo: [
                    { name: user.name || 'Người dùng', email: user.email }
                ],
                subject: emailDetails.subject,
                body: emailDetails.body,
            };

            const result = await mailUtil.sendEmail(emailOptions);
            console.log('Email chào mừng đã được gửi thành công:', result);
        } catch (error) {
            console.error('Lỗi khi gửi email chào mừng:', user.id, error);
        }
    };

    // ================= Gọi các xử lý sau đăng ký =================
    try {
        await createUserConfig();  // Tạo cấu hình mặc định
        await createUserBalance(); // Tạo số dư ban đầu
        await sendWelcomeEmail();  // Gửi email chào mừng
    } catch (error) {
        console.error('Lỗi khi xử lý sau đăng ký:', error.message);
    }
};

