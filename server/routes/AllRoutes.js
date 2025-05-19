const express = require('express')
const router = express.Router()

const auth = require('../Controllers/auth')
const recipes = require('../Controllers/recipes')
const reviews = require('../Controllers/reviews')
const savedRecipes = require('../Controllers/savedRecipes')
const searchHistory = require('../Controllers/searchHistory')
const users = require('../Controllers/users')



router.use('/auth', auth);
router.use('/recipes', recipes);
router.use('/reviews', reviews);
router.use('/savedRecipes', savedRecipes);
router.use('/searchHistory', searchHistory);
router.use('/users', users);

module.exports= router