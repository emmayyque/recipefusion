const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  recipeId: { type: Number, required: true }, 
  title: { type: String, required: true },
  review: { type: String, required: true },
  sentiment: { type: String, enum: ["positive", "neutral", "negative"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
