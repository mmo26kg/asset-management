// middleware/queryMiddleware.js
const listOptionsMiddleware = (req, res, next) => {
    const {
        sortBy = 'id', // Mặc định sort theo id
        sortOrder = 'ASC', // Mặc định sắp xếp tăng dần
        searchBy = 'name',
        keyword,
        perpage = 10, // Mặc định số bản ghi mỗi trang
        page = 1 // Mặc định là trang đầu tiên
    } = req.query;

    // Tính toán offset dựa trên perpage và page
    const offset = (page - 1) * perpage;

    // Lưu thông tin vào req để dùng ở các API list
    req.listOptions = {
        sortBy,
        sortOrder: sortOrder.toUpperCase(), // Đảm bảo luôn là ASC hoặc DESC
        searchBy,
        keyword,
        perpage: parseInt(perpage, 10),
        page: parseInt(page, 10),
        offset: parseInt(offset, 10),
    };

    delete req.query.sortBy;
    delete req.query.sortOrder;
    delete req.query.searchBy;
    delete req.query.keyword;
    delete req.query.perpage;
    delete req.query.page;
    delete req.query.offset;

    next();
};

module.exports = {listOptionsMiddleware};
