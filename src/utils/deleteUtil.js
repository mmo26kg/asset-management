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

// Danh sách các ràng buộc xóa cho từng model
exports.UserDeleteConstraint = [
    new DeleteConstraint(models.User, models.Transaction, 'userId', 'Restrict'),
    new DeleteConstraint(models.User, models.Account, 'userId', 'Restrict'),
    new DeleteConstraint(models.User, models.Config, 'userId', 'Cascade'),
    new DeleteConstraint(models.User, models.UserBalance, 'userId', 'SetNull'),
];

exports.AccountDeleteConstraint = [
    new DeleteConstraint(models.Account, models.Transaction, 'accountId', 'Restrict'),
    new DeleteConstraint(models.Account, models.UserBalance, 'accountId', 'SetNull'),
];

exports.CategoryDeleteConstraint = [
    new DeleteConstraint(models.Category, models.UserBalance, 'categoryId', 'Restrict'),
    new DeleteConstraint(models.Category, models.Category, 'parentId', 'Cascade'),
    new DeleteConstraint(models.Category, models.AssetType, 'assetTypeId', 'SetNull'),
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
exports.deleteService = async (model, id, deleteConstraints, option) => {
    const validOptions = ['force', 'default', 'check'];
    if (!validOptions.includes(option)) {
        return {
            success: false,
            message: `Tùy chọn không hợp lệ. Chỉ chấp nhận: ${validOptions.join(', ')}.`,
        };
    }

    if (option === 'check') {
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

    const allowDeleteResult = await this.allowDelete(id, deleteConstraints);
    if (!allowDeleteResult.success) {
        return {
            success: false,
            message: 'Không thể xóa vì có các ràng buộc chưa được xử lý.',
            details: allowDeleteResult.details,
        };
    }

    await this.executeCascade(id, deleteConstraints, option);
    await this.executeSetNull(id, deleteConstraints, option);
    await this.executeDelete(model, id, option);

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
