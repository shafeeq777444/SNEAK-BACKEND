const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../model/Admin'); 
require('dotenv').config()

// MongoDB connection string (adjust it based on your environment)


async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database.');

        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin already exists. Skipping seed.');
            return;
        }

        // Hash the admin password
        const hashedPassword = await bcrypt.hash('admin', 10);

        // Create the admin user
        const admin = new Admin({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin',
        });

        await admin.save();
        console.log('Admin user added successfully!');
    } catch (err) {
        console.error('Error seeding admin:', err.message);
    } finally {
        // Disconnect from the database
        mongoose.disconnect();
        console.log('Database connection closed.');
    }
}

seedAdmin();
