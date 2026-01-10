const { Schema, model, models } = require("mongoose");

const carSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Profile",
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = models.Car || model("Car", carSchema);