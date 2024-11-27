const models = require('../models'); // Import models


// Lớp DeleteConstraint dùng để định nghĩa các ràng buộc khi xóa
class DeleteConstraint {
    constructor(deletedModel, affectModel, foreignKey, onDelete) {
        this.deletedModel = deletedModel; // Model cha
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
 * Kiểm tra xem có các ràng buộc 'Restrict' khi xóa hay không
 * @param {number} id - ID của đối tượng cần kiểm tra
 * @param {Array} deleteConstraints - Danh sách các ràng buộc xóa
 * @returns {Object} Kết quả kiểm tra
 */
exports.checkRestrict = async (id, deleteConstraints) => {
    const restrictConstraints = deleteConstraints.filter(constraint => constraint.onDelete === 'Restrict');
    const results = [];
    
    // Kiểm tra từng ràng buộc 'Restrict'
    for (const constraint of restrictConstraints) {
        const count = await constraint.affectModel.count({
            where: { [constraint.foreignKey]: id },
        });
        
        if (count > 0) {
            results.push({ model: constraint.affectModel.name, count });
        }
    }

    return results;
};

// ==================== Xử lý xóa ====================

/**
 * Xử lý logic xóa cho các controller
 * @param {Function} serviceMethod - Hàm xử lý xóa từ service
 * @param {Object} modelNames - Tên của model để thông báo lỗi
 * @param {Object} res - Đối tượng phản hồi (response)
 */
exports.handleDeleteService = async (serviceMethod, modelNames, res) => {
    try {
        const result = await serviceMethod();

        // Trường hợp không tìm thấy dữ liệu
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy ${modelNames}.`,
            });
        }

        // Trường hợp có ràng buộc không thể xóa
        if (result.success === false) {
            return res.status(400).json({
                success: false,
                message: result.message,
                details: result.details,
                countModel: result.count,
            });
        }

        if (result.success === true) {
            return res.status(400).json({
                success: true,
                message: result.message,
                // details: result.details,
                // countModel: result.count,
            });
        }

    } catch (error) {
        // Xử lý lỗi hệ thống
        return res.status(500).json({
            success: false,
            message: `Đã xảy ra lỗi khi xóa ${modelNames}.`,
            error: error.message,
        });
    }
};

/**
 * Kiểm tra các ràng buộc và thực hiện xóa dữ liệu
 * @param {Object} model - Model cần xóa
 * @param {number} id - ID của đối tượng cần xóa
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @param {string} option - Lựa chọn kiểu xóa ('force' hoặc 'default')
 * @returns {Object} Kết quả xử lý
 */
exports.deleteService = async (model, id, deleteConstraints, option) => {
    const validOptions = ['force', 'default']; // Các tùy chọn hợp lệ cho xóa
    if (!validOptions.includes(option)) {
        return {
            success: false,
            message: `Tùy chọn không hợp lệ. Chỉ chấp nhận: ${validOptions.join(', ')}.`,
        };
    }

    // Kiểm tra ràng buộc xóa 'Restrict'
    const allowDeleteResult = await this.allowDelete(id, deleteConstraints);
    if (!allowDeleteResult.success) {
        return {
            success: false,
            message: `Không thể xóa ${model.name} vì còn tồn tại các đối tượng phụ thuộc.`,
            details: allowDeleteResult.details,
        };
    }

    // Tiến hành xóa theo các loại hành vi
    await this.executeCascade(id, deleteConstraints, option);
    await this.executeSetNull(id, deleteConstraints, option);
    await this.executeDelete(model, id, option);

    return {
        success: true,
        message: `${model.name} với ID ${id} đã được xóa thành công (${option}).`,
    };
};

// ==================== Thực hiện các hành động xóa ====================

/**
 * Xóa dữ liệu của model (cứng hoặc mềm tùy theo option)
 * @param {Object} model - Model cần xóa
 * @param {number} id - ID của đối tượng cần xóa
 * @param {string} option - Kiểu xóa ('force' hoặc 'default')
 */
exports.executeDelete = async (model, id, option) => {
    const force = option === 'force'; // Nếu 'force', thực hiện xóa cứng
    await model.destroy({ where: { id }, force });
    console.log(`Đã xóa ${model.name} với ID ${id} (${force ? 'xóa cứng' : 'xóa mềm'}).`);
};

/**
 * Thực hiện xóa cascade cho các model có ràng buộc 'Cascade'
 * @param {number} id - ID của đối tượng cần xóa
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @param {string} option - Kiểu xóa ('force' hoặc 'default')
 */
exports.executeCascade = async (id, deleteConstraints, option) => {
    const cascadeConstraints = deleteConstraints.filter(constraint => constraint.onDelete === 'Cascade');
    
    for (const constraint of cascadeConstraints) {
        await constraint.affectModel.destroy({
            where: { [constraint.foreignKey]: id },
            force: option === 'force', // Xóa cứng nếu option là 'force'
        });
        console.log(`Đã xóa cascade cho ${constraint.affectModel.name} liên quan đến ID ${id}.`);
    }
};

/**
 * Thực hiện cập nhật trường khóa ngoại thành null cho các model có ràng buộc 'SetNull'
 * @param {number} id - ID của đối tượng cần xóa
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
        console.log(`Đã cập nhật trường ${constraint.foreignKey} thành null cho ${constraint.affectModel.name} liên quan đến ID ${id}.`);
    }
};

// ==================== Kiểm tra ràng buộc xóa ====================

/**
 * Kiểm tra các ràng buộc xóa cho hành vi 'Restrict', 'Cascade', và 'SetNull'
 * @param {number} id - ID của đối tượng cần kiểm tra
 * @param {Array} deleteConstraints - Các ràng buộc xóa cần kiểm tra
 * @returns {Object} Kết quả kiểm tra
 */
exports.allowDelete = async (id, deleteConstraints) => {
    const restrictResults = await this.checkRestrict(id, deleteConstraints);
    return restrictResults.length === 0
        ? { success: true }
        : { success: false, details: restrictResults };
};
