var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', async function(req, res, next) {
  //Print 100 recipes on home page
  console.log("Loading recipes for home page");
  try {
    // Get the recipes to show from the API 
    const response = await fetch('http://worker:80/recipes/?offset=0&limit=100', {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    });
    console.log(response)
    const recipes = await response.json();
    console.log(recipes)

    // Send the recipes to home view
    res.render('home', { home_recipes: recipes });

  } catch (error) {
    console.error("Error: could not load the recipes", error);
    res.render('home', { home_recipes: [], error: "Cannot communicate with API" });
  }
});




/* GET search page. */
router.get('/search', async function(req, res, next) {
  const query = req.query.q || '';

  try {
    const response = await fetch(`http://worker:80/recipes?offset=0&limit=100`);
    const allRecipes = await response.json();

    const results = allRecipes.filter(recipe => {
      if (!query) return false;
      return recipe.title.toLowerCase().includes(query.toLowerCase());
    });

    res.render('search', { query, results });
  } catch (error) {
    console.error(error);
    res.render('search', { query, results: [] });
  }
})


/* GET recipe page (by title). */
router.get('/recipe/:title', async function(req, res, next) {
  const title = req.params.title;
  const response = await fetch(`http://worker:80/recipes/${encodeURIComponent(title)}`);
  const recipe = await response.json();
  res.render('recipe', { recipe });
});
module.exports = router;


