var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Recipe Finder' });
});


/* GET search page. */
router.get('/search', function(req, res, next) {

  // Store the keys words written by the user in the search bar
  const query = req.query.q; 

  // Get all the recipes from data base
  const recipes = [
    {id:1, name: 'Lasagna', ingredients: '2 tomatoes /n 20cl of cream', instruction: 'cook the tomatos'},
    {id:2, name: 'Pizza', ingredients: '200g of flour /n 100g of cheese', instruction: 'mix the flour...'},
    {id:3, name: 'French fries', ingredients: '5 potatoes /n salt', instruction: 'cut the potatoes'},
  ];

  // Filter the results matching the key words
  const results = recipes.filter(recipe => {
    if (!query) return false;
    
    const q = query.toLowerCase();
    const name = recipe.name.toLowerCase();
    const ingredients = recipe.ingredients.toLowerCase();


    // Returns true if one contains the other
    return name.includes(q) || q.includes(name) || ingredients.includes(q); 

  });

  //Sends the matching results to search.jade view
  res.render('search', { query: query, results: results });
})


/* GET recipe page (by ID). */
router.get('/recipe/:id', function(req, res, next) {
  const recipeId = parseInt(req.params.id);

  // Get all the recipes from data base
  const recipes = [
    {id:1, name: 'Lasagna', ingredients: '2 tomatoes \n 20cl of cream', instruction: 'cook the tomatos'},
    {id:2, name: 'Pizza', ingredients: '200g of flour \n 100g of cheese', instruction: 'mix the flour...'},
    {id:3, name: 'French fries', ingredients: '5 potatoes \n salt', instruction: 'cut the potatoes'}
  ];

// Find the recipe matching ID
  const recipe = recipes.find(r => r.id === recipeId);

 // Error: if non existing recipe id
  if (!recipe) {
    return res.status(404).send("Error: Cannot find recipe");
  }
  res.render('recipe', { recipe: recipe });
});
module.exports = router;


