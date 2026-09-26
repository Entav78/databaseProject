var express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/header-demo', (req, res) => {
  const html = '<h1>Welcome to the hotel!</h1>';

  if (req.isAuthenticated()) {
  res.setHeader('Content-Type', 'text/html');
} else {
  res.setHeader('Content-Type', 'text/plain');
}

  res.send(html);
});

module.exports = router;
