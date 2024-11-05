const mysql = require('mysql2/promise');

async function clearData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Spiderman97@',
        database: 'asset-management'
    });

    const sqlCommands = [
        `DELETE FROM \`User\`;`,
        `DELETE FROM \`UserBalance\`;`,
        `DELETE FROM \`Transaction\`;`,
        `DELETE FROM \`Account\`;`,
        `DELETE FROM \`Stock\`;`,
        `DELETE FROM \`Category\`;`,
        `DELETE FROM \`AssetType\`;`,
        `DELETE FROM \`Config\`;`,
        `DELETE FROM \`Currency\`;`
    ];

    for (const command of sqlCommands) {
        try {
            await connection.query(command);
            console.log('Executed: ', command);
        } catch (error) {
            console.error('Error executing command:', error);
        }
    }

    await connection.end();
}

clearData();
