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
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: `uploads/${filename}`,
        Expires: 3600,  // URL có hiệu lực trong 1 giờ
    };

    return await s3.getSignedUrlPromise('putObject', params);
};

// Lấy URL công khai của ảnh (nếu bucket public)
exports.getImageUrl = async (imageKey) => {
    return `${process.env.CLOUDFLARE_ENDPOINT}/${process.env.CLOUDFLARE_BUCKET_NAME}/${imageKey}`;
};