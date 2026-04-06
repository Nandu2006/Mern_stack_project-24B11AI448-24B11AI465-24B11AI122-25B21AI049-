/**
 * seed.js — Populate MongoDB with demo users and bus data.
 * Run: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');

const SALT_ROUNDS = 10;

const USERS_SEED = [
    // Students
    { username: 'student1', password: 'pass123', name: 'Arjun Kumar', collegeId: 'STU001', role: 'student', email: 'arjun@college.edu' },
    { username: 'student2', password: 'pass456', name: 'Priya Sharma', collegeId: 'STU002', role: 'student', email: 'priya@college.edu' },
    { username: 'student3', password: 'pass789', name: 'Rahul Singh', collegeId: 'STU003', role: 'student', email: 'rahul@college.edu' },
    // Faculty
    { username: 'faculty1', password: 'fpass123', name: 'Dr. Ramesh Nair', collegeId: 'FAC001', role: 'faculty', email: 'ramesh@college.edu' },
    { username: 'faculty2', password: 'fpass456', name: 'Prof. Meena Iyer', collegeId: 'FAC002', role: 'faculty', email: 'meena@college.edu' },
    { username: 'faculty3', password: 'fpass789', name: 'Dr. Suresh Pillai', collegeId: 'FAC003', role: 'faculty', email: 'suresh@college.edu' },
];

const BUSES_SEED = [
    { busNumber: '101', driverName: 'Rajesh Kumar', driverMobile: '+91 98401 12345', totalSeats: 40, availableSeats: 12, route: 'Main Gate → Block A → Library → Hostel', locations: ['main gate', 'block a', 'library', 'hostel', 'gate'], timing: '8:00 AM - 6:00 PM', color: '#4F46E5' },
    { busNumber: '202', driverName: 'Suresh Sharma', driverMobile: '+91 98402 23456', totalSeats: 35, availableSeats: 0, route: 'City Center → College Main → Admin Block', locations: ['city center', 'city', 'admin', 'admin block', 'main'], timing: '7:30 AM - 5:30 PM', color: '#DC2626' },
    { busNumber: '413', driverName: 'Vijay Patel', driverMobile: '+91 98403 34567', totalSeats: 50, availableSeats: 27, route: 'North Campus → Science Block → Sports Ground', locations: ['north campus', 'north', 'science', 'science block', 'sports'], timing: '8:30 AM - 7:00 PM', color: '#059669' },
    { busNumber: 'TC01', driverName: 'Anil Verma', driverMobile: '+91 98404 45678', totalSeats: 30, availableSeats: 5, route: 'Town Center → Market → East Gate', locations: ['town center', 'town', 'market', 'east gate', 'east'], timing: '7:00 AM - 5:00 PM', color: '#D97706' },
    { busNumber: '305', driverName: 'Mohan Das', driverMobile: '+91 98405 56789', totalSeats: 45, availableSeats: 33, route: 'South Zone → Cafeteria → Main Block', locations: ['south zone', 'south', 'cafeteria', 'canteen', 'main block'], timing: '8:00 AM - 6:30 PM', color: '#7C3AED' },
    { busNumber: 'EX02', driverName: 'Ravi Kumar', driverMobile: '+91 98406 67890', totalSeats: 40, availableSeats: 0, route: 'Express Route: Airport → College', locations: ['airport', 'express', 'ex02'], timing: '6:30 AM - 4:00 PM', color: '#DC2626' },
    { busNumber: '508', driverName: 'Sanjay Gupta', driverMobile: '+91 98407 78901', totalSeats: 42, availableSeats: 18, route: 'West Campus → Workshop → Labs', locations: ['west campus', 'west', 'workshop', 'labs', 'laboratory'], timing: '8:00 AM - 7:00 PM', color: '#0891B2' },
    { busNumber: 'SP10', driverName: 'Deepak Singh', driverMobile: '+91 98408 89012', totalSeats: 25, availableSeats: 9, route: 'Special Route: Staff Quarters → College', locations: ['staff quarters', 'staff', 'quarters', 'special'], timing: '7:45 AM - 5:45 PM', color: '#BE185D' },
    { busNumber: '620', driverName: 'Arjun Nair', driverMobile: '+91 98409 90123', totalSeats: 48, availableSeats: 41, route: 'Metro Station → Central Park → College', locations: ['metro', 'metro station', 'central park', 'central', 'park'], timing: '8:15 AM - 6:15 PM', color: '#65A30D' },
    { busNumber: 'NT03', driverName: 'Pradeep Reddy', driverMobile: '+91 98410 01234', totalSeats: 38, availableSeats: 22, route: 'New Township → Bypass Road → College', locations: ['new township', 'township', 'bypass', 'bypass road', 'nt03'], timing: '7:30 AM - 6:00 PM', color: '#EA580C' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        // Clear existing data
        await Promise.all([User.deleteMany(), Bus.deleteMany(), Booking.deleteMany()]);
        console.log('🗑️  Cleared existing data');

        // Hash passwords and create users
        const users = await Promise.all(
            USERS_SEED.map(async (u) => {
                const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
                return { ...u, passwordHash, password: undefined };
            })
        );
        await User.insertMany(users);
        console.log(`✅ Created ${users.length} users`);

        // Create buses
        await Bus.insertMany(BUSES_SEED);
        console.log(`✅ Created ${BUSES_SEED.length} buses`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Student login:  student1 / pass123');
        console.log('Faculty login:  faculty1 / fpass123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
