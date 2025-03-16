const express = require('express');
const sequelize = require('./config/config');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const authRoutes = require('./routers/authRouters');
const governmentRoutes = require('./routers/governmentRoutes');
const hospitalRoutes = require('./routers/hospitalRoute');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/hospital', hospitalRoutes);


const seedGovernment = async () => {
    const govEmail = 'government@ethiopia.gov';
    const govPassword = 'SecurePassword123'; // You can change this
    const hashedPassword = await bcrypt.hash(govPassword, 10);

    const existingGov = await User.findOne({ where: { email: govEmail } });
    if (!existingGov) {
        await User.create({
            email: govEmail,
            password_hash: hashedPassword,
            role: 'government',
            is_approved: true,
        });
        console.log('✅ Government account seeded!');
    } else {
        console.log('✅ Government account already exists.');
    }
};


sequelize.sync().then(async () => {
    await seedGovernment();
    app.listen(6000, () => console.log('🚀 Server running on port 6000'));
});
