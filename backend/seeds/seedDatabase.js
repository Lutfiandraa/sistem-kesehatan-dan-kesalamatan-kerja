const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if admin user already exists
    const existingAdmin = await query(
      'SELECT * FROM users WHERE email = $1 OR email = $2',
      ['admin@gmail.com', 'admin@safetyku.com']
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists, skipping seed');
      return;
    }
    
    // Create admin user dengan email admin@gmail.com
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await query(
      `INSERT INTO users (username, email, password_hash, full_name, role, department, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'admin',
        'admin@gmail.com',
        hashedPassword,
        'Administrator',
        'admin',
        'IT',
        true
      ]
    );
    
    console.log('✅ Admin user created:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: admin123');
    
    // Create sample user
    const userPassword = await bcrypt.hash('user123', 10);
    await query(
      `INSERT INTO users (username, email, password_hash, full_name, role, department, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'user1',
        'user@safetyku.com',
        userPassword,
        'Sample User',
        'user',
        'Production',
        true
      ]
    );
    
    console.log('✅ Sample user created:');
    console.log('   Email: user@safetyku.com');
    console.log('   Password: user123');
    
    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();

