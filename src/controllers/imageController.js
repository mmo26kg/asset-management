const imageService = require('../services/imageService');
// const deleteUtil = require('../utils/deleteUtil')
// Lấy URL để upload ảnh lên Cloudflare R2

exports.getUploadUrl = async (req, res) => {
    try {
        const { filename } = req.query;
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const result = await imageService.generateUploadUrl(filename);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy URL công khai để tải ảnh về
exports.getImageUrl = async (req, res) => {
    try {
        const { imageKey } = req.params;
        const imageUrl = await imageService.getImageUrl(imageKey);
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};