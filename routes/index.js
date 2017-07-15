var express = require('express');
var router = express.Router();
var database = require('../public/javascripts/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'apt-get' });
});

router.get('/input', function(req, res, next) {
  res.render('input', { title: 'Input Apartment'});
})

router.post('/addApartment', function(req, res, next) {
  console.log("req body");
  console.log(req.body);
  database.addApartment(req.body);
  res.redirect('/');
})

module.exports = router;
