const dayjs = require('dayjs');

// Tạo nội dung email chào mừng
exports.welcomeUserRegister = (user) => {
    const formattedDate = dayjs(user.createdAt).format('MMM.DD YYYY hh:mm');

    const subject = `Chào mừng  ${user.name || 'bạn'} đến với nền tảng của chúng tôi!`;

    const textContent = `
        Xin chào ${user.name || 'Bạn'},\n\n
        Chào mừng bạn đến với nền tảng của chúng tôi! Chúng tôi rất vui khi có bạn đồng hành.\n\n
        Thông tin tài khoản của bạn:\n
        - Username: ${user.username}\n
        - Thành viên: ${user.membership}\n
        - Vai trò: ${user.role}\n
        - Ngày đăng ký: ${formattedDate}\n\n
        Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.\n\n
        Trân trọng,\nĐội ngũ của chúng tôi
    `;

    const htmlContent = `
        <p>Xin chào <b>${user.name || 'Người dùng'}</b>,</p>
        <p>Chào mừng bạn đến với nền tảng của chúng tôi! Chúng tôi rất vui khi có bạn đồng hành.</p>
        <p><b>Thông tin tài khoản của bạn:</b></p>
        <ul>
            <li><b>Username:</b> ${user.username}</li>
            <li><b>Thành viên:</b> ${user.membership}</li>
            <li><b>Vai trò:</b> ${user.role}</li>
            <li><b>Ngày đăng ký:</b> ${formattedDate}</li>
        </ul>
        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
        <p>Trân trọng,</p>
        <p><b>Đội ngũ của chúng tôi</b></p>
    `;



    return {
        body: {
            text: textContent,
            html: htmlContent
        },
        subject: subject
    };
};


