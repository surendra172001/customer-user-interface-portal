//jshint esversion:6

const express = require("express");
const router = express.Router();

router.get('/', function(req, res){
    res.render("index");
});

router.get('/login', function(req, res){
    res.render("login_before");
});

router.get('/register', function(req, res){
    res.render("register_before");
});

module.exports = router;
