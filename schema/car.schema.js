const { Schema, model, models } = require("mongoose");

const carSchema = new Schema(
  {
    brand: { type: String, required: true }, 
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    year: { type: Number, required: true },
    distance: { type: Number, default: 0 },
    description: { type: String },
    tint: { type: String, enum: ["bor", "yo'q"], required: true },
    engine: { type: Number, required: true },
    gearbook: { type: String, required: true },

    interiorImage360: { type: String, required: true },
    exteriorImage360: { type: String, required: true },
    carTypeImage: { type: String, required: true },

    likes: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  },
  { timestamps: true }
);

module.exports = models.Car || model("Car", carSchema);