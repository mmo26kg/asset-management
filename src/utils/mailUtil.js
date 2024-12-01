require('dotenv').config(); // Tải biến môi trường từ .env

const nodemailer = require('nodemailer');

// Đối tượng chứa cấu hình email từ môi trường
const emailConfig = {
    senderName: process.env.EMAIL_SENDER_NAME,
    senderEmail: process.env.EMAIL_SENDER_EMAIL,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    service: process.env.EMAIL_SERVICE,
};

// Gửi email
exports.sendEmail = async (options) => {
    try {
        // ================= Kiểm tra và chuẩn bị thông tin =================
        if (!options || !options.receiverInfo || !Array.isArray(options.receiverInfo) || options.receiverInfo.length === 0) {
            throw new Error('Danh sách người nhận không hợp lệ.');
        }

        const emailDetails = {
            subject: options.subject || 'No Subject',  // Tiêu đề email
            text: options.body?.text || '',           // Nội dung dạng text
            html: options.body?.html || '',           // Nội dung dạng HTML
        };

        const receivers = options.receiverInfo.map(receiver => receiver.email).join(',');

        // ================= Cấu hình transporter =================
        const transporter = nodemailer.createTransport({
            service: emailConfig.service, // Ví dụ: Gmail
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass,
            },
        });

        // ================= Cấu hình thông tin email =================
        const mailOptions = {
            from: `"${emailConfig.senderName}" <${emailConfig.senderEmail}>`, // Người gửi
            to: receivers,                                                   // Danh sách người nhận
            subject: emailDetails.subject,                                   // Tiêu đề
            text: emailDetails.text,                                         // Nội dung text
            html: emailDetails.html,                                         // Nội dung HTML
        };

        // ================= Gửi email =================
        const result = await transporter.sendMail(mailOptions);
        console.log('Email đã được gửi thành công:', result);
        return result;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error.message);
        throw error;
    }
};

// Gửi email thử nghiệm
exports.sendTestEmail = async () => {
    try {
        const result = await exports.sendEmail({
            receiverInfo: [
                { name: 'Jane Smith', email: 'hongducmmo@gmail.com' },
            ],
            subject: 'Test Email',
            body: {
                text: 'This is a plain text version of the email.',
                html: '<p>This is an <b>HTML</b> version of the email.</p>',
            },
        });

        console.log('Kết quả gửi email:', result);
    } catch (error) {
        console.error('Lỗi khi gửi email thử nghiệm:', error.message);
    }
};