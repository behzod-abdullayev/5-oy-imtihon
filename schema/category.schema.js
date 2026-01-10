const { Schema, model } = require("mongoose")

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
        max: [new Date().getFullYear(), "brend  tashkil etilgan yil hozirgi yildan katta bolmasiligi kerak"],
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
        maxLength: [150, "tavsif eng ko'pi 150 ta belgidan iborat bolishi lozim"]
    }
},
{
    timestamps: true
})

module.exports = model("Category", categorySchema)