const express = require('express');
const router = express.Router();
const mailUtil = require('../utils/mailUtil');



const testFunctionController = async (req, res) => {
    try {


        console.log('A :');
        mailUtil.sendTestEmail()




        return res.status(200).json({
            message: 'Đã test xong, check console'
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

};

router.get('/', testFunctionController);


module.exports = router;
