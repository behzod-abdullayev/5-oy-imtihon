const { Schema, model, models } = require("mongoose");

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        type: String,
        required: [true, "brend logotipi rasmi bo'lishi kerak"]
    },
    foundedYear: {
        type: Number,
        max: [new Date().getFullYear(), "brend tashkil etilgan yil hozirgi yildan katta bo'lmasligi kerak"],
        trim: true
    },
    founder: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        minLength: [3, "tavsif kamida 3 ta harfdan iborat bo'lishi kerak "],
        maxLength: [200, "tavsif eng ko'pi 200 ta belgidan iborat bo'lishi lozim"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    }
}, {
    timestamps: true
});

module.exports = models.Category || model("Category", categorySchema);