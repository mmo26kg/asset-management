const { User } = require('../models');
const configService = require('../services/configService');
const userBalanceService = require('../services/userBalanceService');
const mailUtil = require('../utils/mailUtil');
const dayjs = require('dayjs'); // Import dayjs


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
        try {
            const emailOptions = {
                receiverInfo: [
                    { name: user.name || 'Người dùng', email: user.email }
                ],
                subject: 'Chào mừng bạn đến với nền tảng của chúng tôi!',
                body: {
                    text: `
                        Xin chào ${user.name || 'Người dùng'},\n\n
                        Chào mừng bạn đến với nền tảng của chúng tôi! Chúng tôi rất vui khi có bạn đồng hành.\n\n
                        Thông tin tài khoản của bạn:\n
                        - Username: ${user.username}\n
                        - Thành viên: ${user.membership}\n
                        - Vai trò: ${user.role}\n
                        - Ngày đăng ký: ${new Date(user.createdAt).toLocaleDateString()}\n\n
                        Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.\n\n
                        Trân trọng,\nĐội ngũ của chúng tôi
                    `,
                    html: `
                        <p>Xin chào <b>${user.name || 'Người dùng'}</b>,</p>
                        <p>Chào mừng bạn đến với nền tảng của chúng tôi! Chúng tôi rất vui khi có bạn đồng hành.</p>
                        <p><b>Thông tin tài khoản của bạn:</b></p>
                        <ul>
                            <li><b>Username:</b> ${user.username}</li>
                            <li><b>Thành viên:</b> ${user.membership}</li>
                            <li><b>Vai trò:</b> ${user.role}</li>
                            <li><b>Ngày đăng ký:</b> ${dayjs(user.createdAt).format('MMM.DD YYYY hh:mm')}</li>
                        </ul>
                        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                        <p>Trân trọng,</p>
                        <p><b>Đội ngũ của chúng tôi</b></p>
                    `,
                },
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

