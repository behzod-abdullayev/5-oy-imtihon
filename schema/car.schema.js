const { Schema, model } = require("mongoose");

const carSchema = new Schema({
    brand: { 
        type: String,
        required: [true, "Markani kiritish shart"],
        trim: true
    },
    name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
    tint: {
        type: String,
        enum: {
            values: ["bor", "yo'q"],
            message: "Tanirovkaga faqat 'bor' yoki 'yo'q' kiritish mumkin"
        },
        required: true
    },
    engine: {
        type: Number,
        required: true,
        min: [0.1, "Motor hajmi musbat bo'lishi shart"],
    },
    year: {
        type: Number,
        required: true,
        min: [1800, "Yil 1800 dan kichik bo'lmasligi kerak"],
        max: [new Date().getFullYear(), "Yil hozirgi yildan katta bo'lmasligi kerak"]
    },
    color: {
        type: String,
        required: [true, "Rangni kiriting"],
        trim: true
    },
    distance: {
        type: Number,
        required: true,
        min: [0, "Mashina yurish masofasi kamida 0 km bo'lishi kerak"],
        default: 0
    },
    gearbook: { 
        type: String,
        required: [true, "Uzatmalar qutisini kiriting"],
        trim: true
    },
    cost: {
        type: Number,
        required: true,
        min: [1, "Mashina narxi musbat bo'lishi kerak"]
    },
    description: {
        type: String,
        trim: true,
        minLength: [3, "Tavsif kamida 3 ta belgidan iborat bo'lsin"],
        maxLength: [1000, "Tavsif juda uzun"]
    },
    interiorImage360: {
        type: String,
        required: [true, "Ichki rasm linki shart"],
        trim: true
    },
    exteriorImage360: {
        type: String,
        required: [true, "Tashqi rasm linki shart"],
        trim: true
    },
    carTypeImage: {
        type: String,
        required: [true, "Model rasm linki shart"],
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}, {
    timestamps: true
});

module.exports = model("Car", carSchema);