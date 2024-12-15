const { v4: uuidv4 } = require('uuid');
const { sequelize, AssetType, Category } = require('../models');
const TreeModel = require('tree-model');

// ⚙️ DỮ LIỆU MẪU
const assetTypeData = [
    { name: 'Tiền mặt', description: 'Tiền mặt là các khoản tiền có thể sử dụng ngay' },
    { name: 'Đầu tư', description: 'Các khoản đầu tư với mục tiêu sinh lời' },
    { name: 'Tài sản', description: 'Những thứ bạn sở hữu có giá trị' },
    { name: 'Phải trả', description: 'Các khoản nợ và nghĩa vụ tài chính' },
    { name: 'Phải thu', description: 'Các khoản tiền có quyền nhận từ người khác' }
];

const categoryTreeData = {
    'Tiền mặt': {
        'Tiền mặt trong tài khoản ngân hàng': {
            'Tiền gửi thanh toán': null,
            'Tiền gửi tiết kiệm': null
        },
        'Tiền mặt trong ví': {
            'Tiền mặt tại nhà': null,
            'Tiền mặt trong ví điện tử': null
        },
        'Tiền mặt trong quỹ đầu tư ngắn hạn': null
    },
    'Đầu tư': {
        'Chứng khoán': {
            'Cổ phiếu': null,
            'Trái phiếu': null,
            'Quỹ đầu tư': null,
            'Chứng quyền': null
        },
        'Bất động sản đầu tư': {
            'Nhà cho thuê': null,
            'Đất đai': null
        },
        'Đầu tư mạo hiểm': {
            'Các startup': null,
            'Quỹ đầu tư mạo hiểm': null
        },
        'Đầu tư dài hạn': {
            'Quỹ hưu trí': null,
            'Vàng, bạc, kim loại quý': null,
            'Tiền mã hóa': null
        }
    },
    'Tài sản': {
        'Tài sản vật chất': {
            'Nhà ở': null,
            'Xe cộ': null,
            'Trang thiết bị gia đình': null,
            'Các thiết bị chuyên dụng': null
        },
        'Tài sản vô hình': {
            'Bằng sáng chế': null,
            'Thương hiệu': null,
            'Quyền sở hữu trí tuệ': null
        },
        'Tài sản khác': {
            'Bộ sưu tập nghệ thuật': null,
            'Sưu tập đồ cổ': null,
            'Bộ sưu tập tem, đồng tiền': null
        }
    },
    'Phải trả': {
        'Nợ ngắn hạn': {
            'Nợ thẻ tín dụng': null,
            'Các khoản vay tiêu dùng': null,
            'Các khoản vay mua sắm': null
        },
        'Nợ dài hạn': {
            'Vay mua nhà': null,
            'Vay sinh viên': null,
            'Vay kinh doanh': null
        },
        'Nghĩa vụ khác': {
            'Tiền thuê nhà chưa trả': null,
            'Tiền thuế chưa trả': null,
            'Phí bảo hiểm chưa thanh toán': null
        }
    },
    'Phải thu': {
        'Phải thu từ khách hàng': {
            'Các khoản tiền từ bán hàng': null,
            'Các khoản tiền từ dịch vụ đã cung cấp': null
        },
        'Phải thu từ bạn bè, người thân': {
            'Các khoản mượn từ bạn bè, gia đình': null,
            'Các khoản vay cá nhân chưa thu': null
        },
        'Phải thu từ hợp đồng': {
            'Tiền thuê nhà chưa thu': null,
            'Các khoản nợ từ hợp đồng kinh doanh': null
        }
    }
};

exports.createSampleData = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối DB thành công!');

        // Xóa dữ liệu cũ
        await Promise.all([
            Category.destroy({ where: {}, truncate: true }),
            AssetType.destroy({ where: {}, truncate: true })
        ]);

        // Tạo AssetType và Category
        for (const { name: assetTypeName, description } of assetTypeData) {
            const assetType = await AssetType.create({ id: uuidv4(), name: assetTypeName, description });
            console.log('🔹 Đã tạo AssetType:', assetType.name);

            const categoryTree = categoryTreeData[assetTypeName];
            if (categoryTree) {
                await createCategoryTree(categoryTree, assetType.id, null);
            }
        }

        console.log('✅ Đã hoàn thành việc tạo cây dữ liệu AssetType và Category!');
    } catch (error) {
        console.error('❌ Đã xảy ra lỗi:', error.message);
    }
};

async function createCategoryTree(tree, assetTypeId = null, parentId = null) {
    for (const [name, children] of Object.entries(tree)) {
        // Đảm bảo logic chỉ có thể có 1 trong 2: parentId hoặc assetTypeId
        const category = await Category.create({
            id: uuidv4(),
            name,
            assetTypeId: parentId ? null : assetTypeId,
            parentId: parentId ?? null
        });
        console.log('📁 Tạo danh mục:', category.name, '🔗 ParentID:', parentId, '🔗 AssetTypeID:', assetTypeId);

        if (children && typeof children === 'object') {
            await createCategoryTree(children, null, category.id);
        }
    }
}

exports.getAssetTypeCategoryTree = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối DB thành công!');

        const [assetTypes, categories] = await Promise.all([
            AssetType.findAll({ raw: true }),
            Category.findAll({ raw: true })
        ]);

        const tree = new TreeModel();

        // Tạo cây cho từng AssetType
        const assetTypeTrees = assetTypes.map(assetType => {
            const root = tree.parse({
                id: assetType.id,
                name: assetType.name,
                description: assetType.description,
                type: 'AssetType',
                children: []  // Danh sách Category sẽ được thêm vào đây
            });

            // Lọc các Category liên quan đến AssetType hiện tại
            const relatedCategories = categories.filter(cat => cat.assetTypeId === assetType.id);

            // Xây dựng cây cho các Category liên quan
            buildCategoryTree(root, relatedCategories);

            return root;
        });

        console.log('🌳 Cây AssetType và Category đã được tạo thành công!');

        // In ra cây dữ liệu đầy đủ
        assetTypeTrees.forEach(root => {
            console.log('\n🌳 Đây là cây của AssetType:', root.model.name);
            console.log(JSON.stringify(root.model, null, 2));
        });

        return assetTypeTrees;
    } catch (error) {
        console.error('❌ Đã xảy ra lỗi:', error.message);
    }
};

function buildCategoryTree(parentNode, categories) {
    // Lọc các danh mục con của Category hiện tại
    const childCategories = categories.filter(cat => cat.parentId === parentNode.model.id);

    childCategories.forEach(child => {
        // Tạo một node cho Category con
        const childNode = parentNode.addChild({
            id: child.id,
            name: child.name,
            type: 'Category',
            parentId: child.parentId,
            assetTypeId: child.assetTypeId,
            children: []
        });

        // Tiếp tục xây dựng cây cho Category con
        buildCategoryTree(childNode, categories);
    });
}