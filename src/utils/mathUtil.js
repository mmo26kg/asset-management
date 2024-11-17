/**
 * Làm tròn số thập phân đến một chữ số cụ thể.
 * @param {number} num - Số cần làm tròn.
 * @param {number} decimalPlaces - Số chữ số thập phân muốn làm tròn.
 * @returns {number} - Số đã được làm tròn.
 */
function roundToDecimal(num, decimalPlaces) {
    if (isNaN(num) || isNaN(decimalPlaces)) {
        throw new Error('Both arguments must be numbers');
    }
    if (decimalPlaces < 0) {
        throw new Error('decimalPlaces must be a non-negative integer');
    }

    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
}


module.exports = {
    roundToDecimal,
};