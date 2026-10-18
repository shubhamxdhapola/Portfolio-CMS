import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin',
        lowercase: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tokenVersion: {
        type: Number,
        default: 0,
        select: false,
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    avatarUrl: {
        type: String,
        default: '',
        trim: true
    },
    sidebarTitle: {
        type: String,
        default: '',
        trim: true
    },
    lastLoginAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export const Admin = User;
export default User;