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

//Test mail
// exports.sendMail = async () => {
//     // Tạo transporter
//     const transporter = nodemailer.createTransport({
//         service: 'gmail', // Dịch vụ email bạn sử dụng, ví dụ: Gmail, Outlook, etc.
//         auth: {
//             user: 'hongducmmo@gmail.com', // Thay thế bằng email của bạn
//             pass: 'ybya odzz fjnr lgmd '   // Thay thế bằng mật khẩu email của bạn
//         }
//     });

//     // Cấu hình email
//     const mailOptions = {
//         from: 'hongducmmo@gmail.com', // Email gửi đi
//         to: 'hongducmmo@gmail.com', // Email nhận
//         subject: 'Test Email', // Chủ đề email
//         text: 'Hello, this is a test email sent from Node.js using Nodemailer.' // Nội dung email dạng văn bản
//     };

//     // Gửi email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log('Error:', error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }



// Test mail


exports.sendEmail = async (options) => {
    const { receiverInfo, subject, body } = options;

    // ================= Chuẩn bị nội dung email =================
    const emailContent = () => {
        try {
            return {
                subject: subject || 'No Subject', // Tiêu đề email
                text: body?.text || '',          // Nội dung dạng text
                html: body?.html || '',          // Nội dung dạng HTML
            };
        } catch (error) {
            console.error('Lỗi khi chuẩn bị nội dung email:', error.message);
            throw error;
        }
    };

    // ================= Cấu hình người gửi =================
    const setupSender = () => {
        try {
            return {
                name: emailConfig.senderName,
                email: emailConfig.senderEmail,
            };
        } catch (error) {
            console.error('Lỗi khi cấu hình người gửi:', error.message);
            throw error;
        }
    };

    // ================= Cấu hình người nhận =================
    const setupReceiver = () => {
        try {
            if (!receiverInfo || !Array.isArray(receiverInfo) || receiverInfo.length === 0) {
                throw new Error('Danh sách người nhận không hợp lệ.');
            }

            return receiverInfo.map(receiver => ({
                name: receiver.name || '',
                email: receiver.email,
            }));
        } catch (error) {
            console.error('Lỗi khi cấu hình người nhận:', error.message);
            throw error;
        }
    };

    // ================= Gửi email =================
    const sendMail = async (emailDetails, sender, receivers) => {
        try {
            const transporter = nodemailer.createTransport({
                service: emailConfig.service, // Thay bằng dịch vụ mail của bạn
                auth: {
                    user: emailConfig.user,  // Lấy từ môi trường
                    pass: emailConfig.pass,  // Lấy từ môi trường
                },
            });

            const mailOptions = {
                from: `"${sender.name}" <${sender.email}>`,
                to: receivers.map(receiver => receiver.email).join(','),
                subject: emailDetails.subject,
                text: emailDetails.text,
                html: emailDetails.html,
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Email đã được gửi thành công:', result);
            return result;
        } catch (error) {
            console.error('Lỗi khi gửi email:', error.message);
            throw error;
        }
    };

    // ================= Gọi các bước xử lý =================
    try {
        const emailDetails = emailContent();
        const sender = setupSender();
        const receivers = setupReceiver();

        return await sendMail(emailDetails, sender, receivers);
    } catch (error) {
        console.error('Lỗi trong quá trình gửi email:', error.message);
        throw error;
    }
};