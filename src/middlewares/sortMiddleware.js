// middlewares/listOptionsMiddleware.js

module.exports = (req, res, next) => {
    let { sortBy = 'id', sortOrder = 'ASC' } = req.query;
    console.log("Call sort middleware")

    if (sortBy) {
        // Nếu không có sortOrder, mặc định là ASC
        sortOrder = sortOrder && sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        // Lưu thông tin sắp xếp vào req
        req.listOptions = {
            sortBy,
            sortOrder,
        };

        delete req.query.sortBy;
        delete req.query.sortOrder;
    } else {
        // Không có sắp xếp, bỏ qua
        req.listOptions = null;
    }

    
    

    next();
};
