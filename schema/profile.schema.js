const { Schema, model, models } = require("mongoose");

const profileSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9]+$/, "Username faqat harf va raqamlardan iborat bo'lishi kerak"]
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
    },
    tempEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 8,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    image: {
        type: String,
        default: "uploads/avatar.png"
    },
    otp: {
        type: String,
        default: null,
    },
    otpTime: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    // Virtual maydonlar JSON javobida chiqishi uchun shart:
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Admin qo'shgan mashinalar
profileSchema.virtual('myCars', {
    ref: 'Car',
    localField: '_id',
    foreignField: 'createdBy'
});

// Admin qo'shgan kategoriyalar
profileSchema.virtual('myCategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'createdBy'
});

module.exports = models.Profile || model("Profile", profileSchema);