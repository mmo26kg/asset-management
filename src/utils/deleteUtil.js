const models = require('../models'); // Import models

// ==================== Định nghĩa ràng buộc xóa ====================

/**
 * Lớp DeleteConstraint dùng để định nghĩa các ràng buộc xóa
 */
class DeleteConstraint {
    constructor(deletedModel, affectModel, foreignKey, onDelete) {
        this.deletedModel = deletedModel; // Model chính (bị xóa)
        this.affectModel = affectModel;   // Model phụ thuộc
        this.foreignKey = foreignKey;     // Khóa ngoại
        this.onDelete = onDelete;         // Hành vi xóa ('Restrict', 'Cascade', 'SetNull')
    }
}

// ==================== Định nghĩa ràng buộc xóa ====================

/**
 * Ràng buộc xóa cho model User
 */
exports.UserDeleteConstraint = [
    new DeleteConstraint(models.User, models.Transaction, 'userId', 'Cascade'),
    new DeleteConstraint(models.User, models.Account, 'userId', 'Cascade'),
    new DeleteConstraint(models.User, models.Config, 'userId', 'Cascade'),
    new DeleteConstraint(models.User, models.UserBalance, 'userId', 'Cascade'),
];

/**
 * Ràng buộc xóa cho model Account
 */
exports.AccountDeleteConstraint = [
    new DeleteConstraint(models.Account, models.Transaction, 'accountId', 'Cascade'),
    new DeleteConstraint(models.Account, models.UserBalance, 'accountId', 'Cascade'),
];

/**
 * Ràng buộc xóa cho model Category
 */
exports.CategoryDeleteConstraint = [
    new DeleteConstraint(models.Category, models.UserBalance, 'categoryId', 'Restrict'),
    new DeleteConstraint(models.Category, models.Account, 'categoryId', 'Restrict'),
    new DeleteConstraint(models.Category, models.Category, 'parentId', 'Cascade'),
];

/**
 * Ràng buộc xóa cho model AssetType
 */
exports.AssetTypeDeleteConstraint = [
    new DeleteConstraint(models.AssetType, models.Category, 'assetTypeId', 'Restrict'),
    new DeleteConstraint(models.AssetType, models.UserBalance, 'assetTypeId', 'Restrict'),
];

/**
 * Ràng buộc xóa cho model Config
 */
exports.ConfigDeleteConstraint = [
    // Config không có quan hệ phụ thuộc.
];

/**
 * Ràng buộc xóa cho model Currency
 */
exports.CurrencyDeleteConstraint = [
    new DeleteConstraint(models.Currency, models.Account, 'currencyId', 'Restrict'),
];

/**
 * Ràng buộc xóa cho model Stock
 */
exports.StockDeleteConstraint = [
    new DeleteConstraint(models.Stock, models.Account, 'stockId', 'Restrict'),
];

/**
 * Ràng buộc xóa cho model Transaction
 */
exports.TransactionDeleteConstraint = [
    // Transaction không có quan hệ phụ thuộc.
];

/**
 * Ràng buộc xóa cho model UserBalance
 */
exports.UserBalanceDeleteConstraint = [
    
];


// ==================== Kiểm tra ràng buộc xóa ====================

/**
 * Kiểm tra các ràng buộc xóa có hành vi 'Restrict'
 * @param {number} id - ID đối tượng
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @returns {Array} Kết quả ràng buộc 'Restrict'
 */
exports.checkRestrict = async (id, deleteConstraints) => {
    const restrictConstraints = deleteConstraints.filter(constraint => constraint.onDelete === 'Restrict');
    const results = [];

    for (const constraint of restrictConstraints) {
        const count = await constraint.affectModel.count({ where: { [constraint.foreignKey]: id } });
        if (count > 0) {
            results.push({ model: constraint.affectModel.name, count });
        }
    }

    return results;
};

/**
 * Kiểm tra các ràng buộc xóa có hành vi 'Cascade'
 * @param {number} id - ID đối tượng
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @returns {Array} Kết quả ràng buộc 'Cascade'
 */
exports.checkCascade = async (id, deleteConstraints) => {
    const cascadeConstraints = deleteConstraints.filter(constraint => constraint.onDelete === 'Cascade');
    const results = [];

    for (const constraint of cascadeConstraints) {
        const count = await constraint.affectModel.count({ where: { [constraint.foreignKey]: id } });
        if (count > 0) {
            results.push({ model: constraint.affectModel.name, count });
        }
    }

    return results;
};

/**
 * Kiểm tra các ràng buộc xóa có hành vi 'SetNull'
 * @param {number} id - ID đối tượng
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @returns {Array} Kết quả ràng buộc 'SetNull'
 */
exports.checkSetNull = async (id, deleteConstraints) => {
    const setNullConstraints = deleteConstraints.filter(constraint => constraint.onDelete === 'SetNull');
    const results = [];

    for (const constraint of setNullConstraints) {
        const count = await constraint.affectModel.count({ where: { [constraint.foreignKey]: id } });
        if (count > 0) {
            results.push({ model: constraint.affectModel.name, count });
        }
    }

    return results;
};

// ==================== Thực hiện hành động xóa ====================

/**
 * Xóa dữ liệu của model (cứng hoặc mềm tùy theo option)
 * @param {Object} model - Model cần xóa
 * @param {number} id - ID đối tượng
 * @param {string} option - Kiểu xóa ('force' hoặc 'default')
 */
exports.executeDelete = async (model, id, option) => {
    const force = option === 'force';
    await model.destroy({ where: { id }, force });
    console.log(`Đã xóa ${model.name} với ID ${id} (${force ? 'xóa cứng' : 'xóa mềm'}).`);
};

/**
 * Thực hiện hành động xóa 'Cascade'
 * @param {number} id - ID đối tượng
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @param {string} option - Kiểu xóa ('force' hoặc 'default')
 */
exports.executeCascade = async (id, deleteConstraints, option) => {
    const cascadeConstraints = deleteConstraints.filter(constraint => constraint.onDelete === 'Cascade');

    for (const constraint of cascadeConstraints) {
        await constraint.affectModel.destroy({
            where: { [constraint.foreignKey]: id },
            force: option === 'force',
        });
        console.log(`Đã xóa cascade cho ${constraint.affectModel.name} liên quan đến ID ${id}.`);
    }
};

/**
 * Thực hiện cập nhật trường khóa ngoại thành null ('SetNull')
 * @param {number} id - ID đối tượng
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @param {string} option - Kiểu xóa ('force' hoặc 'default')
 */
exports.executeSetNull = async (id, deleteConstraints, option) => {
    const setNullConstraints = deleteConstraints.filter(constraint => constraint.onDelete === 'SetNull');

    for (const constraint of setNullConstraints) {
        await constraint.affectModel.update(
            { [constraint.foreignKey]: null },
            { where: { [constraint.foreignKey]: id } }
        );
        console.log(`Đã cập nhật khóa ngoại ${constraint.foreignKey} thành null cho ${constraint.affectModel.name}.`);
    }
};

// ==================== Xử lý logic xóa ====================

/**
 * Kiểm tra ràng buộc xóa và thực hiện hành động xóa
 * @param {Object} model - Model cần xóa
 * @param {number} id - ID đối tượng
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @param {string} option - Kiểu xóa ('force', 'default', hoặc 'check')
 * @returns {Object} Kết quả xử lý
 */
// Xuất hàm deleteService
exports.deleteService = async (model, id, deleteConstraints, option, checkDetail) => {
    
    // -----------------------------------------------
    // Kiểm tra các tùy chọn hợp lệ
    // -----------------------------------------------
    const validOptions = ['force', 'default', 'check', undefined];
    const validCheckDetails = ['restrict', 'cascade', 'setnull', undefined];

    // Kiểm tra tùy chọn xóa hợp lệ
    if (!validOptions.includes(option)) {
        return {
            success: false,
            message: `Tùy chọn không hợp lệ. Chỉ chấp nhận: ${validOptions.join(', ')}.`,
        };
    }

    // Kiểm tra checkDetail hợp lệ
    if (!validCheckDetails.includes(checkDetail)) {
        return {
            success: false,
            message: `Kiểm tra chi tiết không hợp lệ. Chỉ chấp nhận: ${validCheckDetails.join(', ')}.`,
        };
    }

    // -----------------------------------------------
    // Kiểm tra các ràng buộc nếu tùy chọn là 'check'
    // -----------------------------------------------
    if (option === 'check' && !checkDetail) {
        // Kiểm tra các ràng buộc với các điều kiện mặc định (không có checkDetail)
        const restrictArray = await this.checkRestrict(id, deleteConstraints);
        const cascadeArray = await this.checkCascade(id, deleteConstraints);
        const setNullArray = await this.checkSetNull(id, deleteConstraints);

        return {
            success: true,
            type: 'check',
            message: 'Kiểm tra ràng buộc thành công.',
            details: { restrictArray, cascadeArray, setNullArray },
        };
    }

    if (option === 'check' && checkDetail) {
        // Kiểm tra ràng buộc chi tiết khi có checkDetail
        const results = [];
        
        // Lọc các ràng buộc theo checkDetail (chú ý so sánh không phân biệt hoa thường)
        const restrictConstraints = deleteConstraints.filter(constraint =>
            constraint.onDelete.toLowerCase() === checkDetail.toLowerCase()
        );

        // Duyệt qua từng ràng buộc và kiểm tra ảnh hưởng của chúng
        for (const constraint of restrictConstraints) {
            const details = await constraint.affectModel.findAndCountAll({
                where: { [constraint.foreignKey]: id },
                attributes: ['id'],
            });
            console.log('detail:', details);

            // Nếu có bản ghi liên quan đến ràng buộc 
            if (details.count > 0) {
                results.push({
                    constraint: checkDetail,  // Loại ràng buộc (ví dụ: 'restrict')
                    model: constraint.affectModel.name, // Tên model liên quan
                    count: details.count, // Số lượng bản ghi bị ảnh hưởng
                    rows: details.rows, // Các bản ghi bị ảnh hưởng
                });
            }
        }

        return {
            success: true,
            type: 'check',
            message: 'Kiểm tra ràng buộc chi tiết thành công.',
            details: results,
        };
    }

    // -----------------------------------------------
    // Kiểm tra có thể xóa được không nếu không phải là 'check'
    // -----------------------------------------------
    const allowDeleteResult = await this.allowDelete(id, deleteConstraints);

    // Nếu không cho phép xóa, trả về thông báo lỗi
    if (!allowDeleteResult.success) {
        return {
            success: false,
            message: 'Không thể xóa vì có các ràng buộc chưa được xử lý.',
            details: allowDeleteResult.details,
        };
    }

    // -----------------------------------------------
    // Thực thi các thao tác xóa
    // -----------------------------------------------
    // Thực hiện cascade delete nếu cần thiết
    await this.executeCascade(id, deleteConstraints, option);
    
    // Thực hiện set null nếu cần thiết
    await this.executeSetNull(id, deleteConstraints, option);

    // Thực hiện xóa model
    await this.executeDelete(model, id, option);

    // Trả về thông báo thành công
    return {
        success: true,
        message: `${model.name} với ID ${id} đã được xóa thành công (${option}).`,
    };
};


/**
 * Kiểm tra các ràng buộc xóa và xác định khả năng xóa
 * @param {number} id - ID đối tượng
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @returns {Object} Kết quả kiểm tra
 */
exports.allowDelete = async (id, deleteConstraints) => {
    const restrictResults = await this.checkRestrict(id, deleteConstraints);
    return restrictResults.length === 0
        ? { success: true }
        : { success: false, details: restrictResults };
};

// ==================== API handler cho controller ====================

/**
 * API handler để xử lý phản hồi khi xóa
 * @param {Function} serviceMethod - Hàm xử lý xóa từ service
 * @param {string} modelNames - Tên model để hiển thị thông báo
 * @param {Object} res - Đối tượng phản hồi
 */
exports.handleDeleteService = async (serviceMethod, modelNames, res) => {
    try {
        const result = await serviceMethod();

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy ${modelNames}.`,
            });
        }

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                details: result.details,
            });
        }

        if (result.success && result.type === 'check') {
            return res.status(200).json({
                success: true,
                type: 'check',
                message: result.message,
                details: result.details,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Đã xảy ra lỗi khi xử lý yêu cầu.`,
            error: error.message,
        });
    }
};
