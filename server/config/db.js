import mongoose from 'mongoose';

export default async function connectDB() {
    try {
        const uri = process.env.DATABASE_URL;
        await mongoose.connect(uri);
        console.log('Connected to Database');
    } catch (error) {
        console.error('Error connecting to Database:', error.message);
        throw error;
    }
}
