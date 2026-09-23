var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log('Loading recipes for home page');

  try {
    const response = await fetch('http://worker:80/recipes?offset=0&limit=100', {
      method: 'GET',
      headers: {
        accept: '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const recipes = await response.json();
    const homeRecipes = Array.isArray(recipes) ? recipes : [];

    res.render('home', { home_recipes: homeRecipes, error: null });
  } catch (error) {
    console.error('Error: could not load the recipes', error);
    res.render('home', { home_recipes: [], error: 'Cannot communicate with API' });
  }
});

/* GET search page. */
router.get('/search', async function(req, res, next) {
  const query = String(req.query.q || '').trim();

  if (!query) {
    return res.redirect('/');
  }

  try {
    const response = await fetch('http://worker:80/recipes?offset=0&limit=100', {
      method: 'GET',
      headers: {
        accept: '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const allRecipes = await response.json();
    const recipes = Array.isArray(allRecipes) ? allRecipes : [];

    const results = recipes.filter((recipe) => {
      if (!recipe || !recipe.title) return false;
      return recipe.title.toLowerCase().includes(query.toLowerCase());
    });

    res.render('search', { query, results, error: null });
  } catch (error) {
    console.error(error);
    res.render('search', { query, results: [], error: 'Cannot communicate with API' });
  }
});

/* GET recipe page (by title). */
router.get('/recipe/:title', async function(req, res, next) {
  const title = decodeURIComponent(req.params.title || '');

  if (!title) {
    return res.redirect('/');
  }

  try {
    const response = await fetch(`http://worker:80/recipes/${encodeURIComponent(title)}`, {
      method: 'GET',
      headers: {
        accept: '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const recipe = await response.json();
    res.render('recipe', { recipe, error: null });
  } catch (error) {
    console.error(error);
    res.render('recipe', { recipe: null, error: 'Recipe not found' });
  }
});

module.exports = router;


