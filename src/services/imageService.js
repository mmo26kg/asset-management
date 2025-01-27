const AWS = require('aws-sdk');

// Cấu hình AWS SDK để kết nối với Cloudflare R2
const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'auto',
});

// Tạo URL để upload ảnh lên Cloudflare R2
exports.generateUploadUrl = async (filename) => {
    const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `uploads/${filename}`,
        Expires: 3600,  // URL có hiệu lực trong 1 giờ
    };
    await s3.getSignedUrlPromise('putObject', params)

    return await s3.getSignedUrlPromise('getObject', params);
};

// Lấy URL của ảnh từ Cloudflare R2 (tạo URL signed)
exports.getImageUrl = async (imageKey) => {
    const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `uploads/${imageKey}`, // `imageKey` là tên file bạn muốn truy cập
        Expires: 3600,  // URL có hiệu lực trong 1 giờ
    };

    // Tạo URL signed cho ảnh
    try {
        const url = await s3.getSignedUrlPromise('getObject', params);
        return url;
    } catch (error) {
        console.error('Lỗi khi lấy URL:', error);
        throw new Error('Không thể lấy URL cho ảnh');
    }
};