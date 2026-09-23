var express = require('express');
var router = express.Router();

const WORKER_URL = process.env.WORKER_URL;
const SHARDS = Number(process.env.SHARDS);


/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log('Loading recipes for home page');

  try {
    // Get the recipes to show from the API 
    const response = await fetch(`${WORKER_URL}/recipes/?offset=0&limit=100`, {
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
    const answers = await Promise.all(
      Array.from({ length: SHARDS }, (_, shard) =>
        fetch(`${WORKER_URL}/search?q=${encodeURIComponent(query)}&shard=${shard}&shards=${SHARDS}`)
          .then(response => response.json())
      )
    );

    const results = answers
      .flatMap(answer => answer.results)
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    res.render('search', { query, results, error: null });
  } catch (error) {
    console.error(error);
    res.render('search', { query, results: [], error: 'Cannot communicate with API' });
  }
});

/* GET recipe page (by title). */
router.get('/recipe/:title', async function(req, res, next) {
  // express already decodes the url, decoding again breaks the "100% ..." titles
  const title = req.params.title;

  if (!title) {
    return res.redirect('/');
  }

  try {
    const response = await fetch(`${WORKER_URL}/recipes/${encodeURIComponent(title)}`, {
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


