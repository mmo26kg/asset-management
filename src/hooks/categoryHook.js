

// Hàm kiểm tra ràng buộc
exports.validateCategoryConstraints = (category) => {
    const hasParentId = !!category.parentId; // true nếu parentId không null
    const hasAssetTypeId = !!category.assetTypeId; // true nếu assetTypeId không null

    if (!hasParentId && !hasAssetTypeId) {
        throw new Error('Category phải có `parentId` hoặc `assetTypeId`, ít nhất một trong hai.');
    }

    if (hasParentId && hasAssetTypeId) {
        throw new Error('Category chỉ được có `parentId` hoặc `assetTypeId`, không được có cả hai.');
    }
}

