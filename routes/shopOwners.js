//jshint esversion:6

const express = require("express");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {User} = require("../models/User");
const {ROLE, ensureAuthenticated, setUser, setRole} = require("../config/auth");

router.get('/login', (req, res) => {
    res.render('shop-owner/login');
});

// TODO: /shopOwner/addItem
// TODO: /shopOwner/viewItem

router.get('/dashboard', setRole(ROLE.SHOPOWNER), ensureAuthenticated, (req, res) => {
    res.render('shop-owner/dashboard', {user : req.user});
});

router.post('/addItem', ensureAuthenticated, (req, res) => {
    res.render('shop-owner/dashboard', {user : req.user});
});

router.get('/viewItems', setRole(ROLE.SHOPOWNER), ensureAuthenticated, (req, res) => {
    console.log(req.user);
    res.render('shop-owner/viewItems', {user : req.user});
});

router.get('/register', (req, res) => {
    res.render('shop-owner/register');
});

router.post('/register', (req, res) => {
    // console.log(req.body);
    const { name, email, password, password2, shopName, latitude, longitude } = req.body;

    const errors = [];

    if (!name || !email || !password || !password2 || !shopName) {
        errors.push({ msg: 'Please fill all the mandatory fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be of length atleast 6 characters' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('shop-owner/register', {
            errors,
            name,
            email,
            password,
            password2,
            shopName,
            latitude,
            longitude
        });
    } else {

        User.findOne({ email: email })
            .then((shopOwner) => {
                if (shopOwner && shopOwner.role == "shopOwner") {
                    errors.push({ msg: "email already exists" });
                    res.render('shop-owner/register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        shopName,
                        latitude,
                        longitude
                    });
                } else {
                    const role = ROLE.SHOPOWNER;
                    const newShopOwner = User({
                        role,
                        name,
                        email,
                        password,
                        shopName,
                        latitude,
                        longitude
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            throw err;
                        }
                        bcrypt.hash(newShopOwner.password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            }
                            newShopOwner.password = hash;
                            newShopOwner.save()
                                .then(shopOwner => {
                                    req.flash('success_msg', 'You are successfully registered and now you can log in');
                                    res.redirect('/shopOwner/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        });
                    });
                }

            }).catch((err) => {
                console.log(err);
            });
    }
    // res.send('register');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/shopOwner/dashboard',
        failureRedirect: '/shopOwner/login',
        failureFlash: true
    })(req, res, next);
});



router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are successfully logged out');
    res.redirect('/shopOwner/login');
});

module.exports = router;
