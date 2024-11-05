const mysql = require('mysql2/promise');

async function runSeeds() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Spiderman97@',
        database: 'asset-management'
    });

    const sqlCommands = [
        `INSERT INTO `User` (`id`, `name`, `username`, `password`, `membership`, `isActive`, `createdAt`, `updatedAt`)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Alice', 'alice123', 'password', 'Basic', true, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Bob', 'bob234', 'Premium', true, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333', 'Charlie', 'charlie345', 'Basic', true, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', 'David', 'david456', 'Premium', true, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555555', 'Eva', 'eva567', 'Basic', true, NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', 'Frank', 'frank678', 'Premium', true, NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', 'Grace', 'grace789', 'Basic', true, NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888888', 'Henry', 'henry890', 'Premium', true, NOW(), NOW()),
    ('99999999-9999-9999-9999-999999999999', 'Ivy', 'ivy901', 'Basic', true, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000000', 'Jack', 'jack012', 'Premium', true, NOW(), NOW());
`,

        `INSERT INTO \`Currency\` (\`id\`, \`name\`, \`symbol\`, \`isActive\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('33333333-3333-3333-3333-333333333333', 'US Dollar', 'USD', true, NOW(), NOW()),
            ('44444444-4444-4444-4444-444444444444', 'Euro', 'EUR', true, NOW(), NOW());`,

        `INSERT INTO \`Config\` (\`id\`, \`currency\`, \`themeColor\`, \`language\`, \`isActive\`, \`userId\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('55555555-5555-5555-5555-555555555555', 'USD', '#FFFFFF', 'en', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
            ('66666666-6666-6666-6666-666666666666', 'EUR', '#000000', 'fr', true, '22222222-2222-2222-2222-222222222222', NOW(), NOW());`,

        `INSERT INTO \`AssetType\` (\`id\`, \`name\`, \`color\`, \`isActive\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('77777777-7777-7777-7777-777777777777', 'Real Estate', '#00FF00', true, NOW(), NOW()),
            ('88888888-8888-8888-8888-888888888888', 'Stock', '#0000FF', true, NOW(), NOW());`,

        `INSERT INTO \`Category\` (\`id\`, \`name\`, \`icon\`, \`isActive\`, \`assetTypeId\`, \`parentId\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('99999999-9999-9999-9999-999999999999', 'Housing', 'house-icon', true, '77777777-7777-7777-7777-777777777777', NULL, NOW(), NOW()),
            ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Rentals', 'rent-icon', true, '77777777-7777-7777-7777-777777777777', '99999999-9999-9999-9999-999999999999', NOW(), NOW()),
            ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Technology', 'tech-icon', true, '88888888-8888-8888-8888-888888888888', NULL, NOW(), NOW()),
            ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Software', 'software-icon', true, '88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW());`,

        `INSERT INTO \`Stock\` (\`id\`, \`name\`, \`stockSymbol\`, \`market\`, \`currentPrice\`, \`isActive\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'TechCorp', 'TCH', 'NYSE', 150.75, true, NOW(), NOW()),
            ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'HealthCorp', 'HLC', 'NASDAQ', 98.25, true, NOW(), NOW());`,

        `INSERT INTO \`Account\` (\`id\`, \`name\`, \`balance\`, \`note\`, \`share\`, \`price\`, \`rate\`, \`isActive\`, \`userId\`, \`currencyId\`, \`categoryId\`, \`stockId\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Alice Savings', 5000.00, 'Primary savings account', 10, 100.00, 1.0, true, '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', NULL, NOW(), NOW()),
            ('11111111-aaaa-bbbb-cccc-111111111111', 'Bob Investments', 1200.00, 'Tech stocks', 5, 240.00, 1.5, true, '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW(), NOW());`,

        `INSERT INTO \`Transaction\` (\`id\`, \`name\`, \`dateTime\`, \`note\`, \`amount\`, \`currency\`, \`isActive\`, \`userId\`, \`accountId\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('22222222-aaaa-bbbb-cccc-222222222222', 'Deposit', NOW(), 'Monthly deposit', 500.00, 'USD', true, '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW(), NOW()),
            ('33333333-aaaa-bbbb-cccc-333333333333', 'Investment Purchase', NOW(), 'Bought tech stocks', 300.00, 'USD', true, '22222222-2222-2222-2222-222222222222', '11111111-aaaa-bbbb-cccc-111111111111', NOW(), NOW());`,

        `INSERT INTO \`UserBalance\` (\`id\`, \`balanceType\`, \`balance\`, \`isActive\`, \`userId\`, \`accountId\`, \`categoryId\`, \`assetTypeId\`, \`createdAt\`, \`updatedAt\`)
        VALUES 
            ('44444444-aaaa-bbbb-cccc-444444444444', 'account', 5000.00, true, '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, NULL, NOW(), NOW()),
            ('55555555-aaaa-bbbb-cccc-555555555555', 'category', 1200.00, true, '22222222-2222-2222-2222-222222222222', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', NOW(), NOW());`
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

runSeeds();
