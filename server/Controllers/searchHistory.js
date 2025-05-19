const express = require("express");
const router = express.Router();
const SearchHistory = require("../models/searchHistory");
const isLogin = require("../middleware/verifyuser"); 

router.post("/add-search", async (req, res) => {
  try {
    const { query, type, filters, userId } = req.body;

    if (!query || !type || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSearch = new SearchHistory({
      userId,
      query,
      type,
      filters,
    });

    await newSearch.save();
    res.status(201).json({ message: "Search saved successfully", search: newSearch });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save search" });
  }
});



router.get("/user-searches", async (req, res) => {
  try {
    const userId = req.query.userId;

    const searches = await SearchHistory.find({ userId })
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json(searches);
  } catch (error) {
    console.error("Fetch error:", error); 
    res.status(500).json({ error: "Failed to retrieve search history" });
  }
});



// GET /api/all-searches
router.get("/all-searches", async (req, res) => {
  try {
    const searches = await SearchHistory.find().sort({ createdAt: -1 });
    res.json(searches);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to retrieve searches" });
  }
});


module.exports = router;
