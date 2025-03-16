const bcrypt = require('bcryptjs');
const { User } = require('./models'); // Import User model
const sequelize = require('./config/config'); // Import database connection

async function seedGovernmentUser() {
    try {
        await sequelize.sync(); // Ensure database is connected

        const passwordHash = await bcrypt.hash('securepassword', 10);

        await User.create({
            email: 'gov@example.com',
            password_hash: passwordHash,
            role: 'government',
        });

        console.log('✅ Government user created.');
    } catch (error) {
        console.error('❌ Error seeding government user:', error);
    } finally {
        process.exit(); // Exit script after execution
    }
}

seedGovernmentUser();
