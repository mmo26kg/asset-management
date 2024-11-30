//Test mail
exports.sendMail = async () => {
    const nodemailer = require('nodemailer');

    // Tạo transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Dịch vụ email bạn sử dụng, ví dụ: Gmail, Outlook, etc.
        auth: {
            user: 'hongducmmo@gmail.com', // Thay thế bằng email của bạn
            pass: 'ybya odzz fjnr lgmd '   // Thay thế bằng mật khẩu email của bạn
        }
    });
    
    // Cấu hình email
    const mailOptions = {
        from: 'hongducmmo@gmail.com', // Email gửi đi
        to: 'hongducmmo@gmail.com', // Email nhận
        subject: 'Test Email', // Chủ đề email
        text: 'Hello, this is a test email sent from Node.js using Nodemailer.' // Nội dung email dạng văn bản
    };
    
    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



    // Test mail