import { db } from './db';

console.log('🌱 Seeding MarketPulse Financial Database...');
db.seed();
const stocks = db.getAllStocks();
console.log(`✅ Database seeded successfully with ${stocks.length} stocks across 11 sectors.`);
console.log(`✅ Default Demo Users Created:`);
console.log(`   - USER: user@marketpulse.com (Password: password123)`);
console.log(`   - ADMIN: admin@marketpulse.com (Password: password123)`);
