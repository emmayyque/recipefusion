const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  query: String,
  type: { type: String, enum: ["text", "ingredients"], required: true, },
  filters: Object,
}, { timestamps: true }); 

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);
module.exports = SearchHistory;
