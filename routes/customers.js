//jshint esversion:6

const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {User} = require("../models/User");
const {Item} = require("../models/Item");
const {ROLE, ensureAuthenticated, setUser, setRole} = require("../config/auth");

router.get('/login', (req, res) => {
    res.render('customer/login');
});

router.get('/dashboard',setRole(ROLE.CUSTOMER), ensureAuthenticated, (req, res) => {
    res.render('customer/dashboard', {user : req.user});
});


router.post('/searchItem', setUser, (req, res) => {
    // console.log(req.user.name);
    const {itemName} = req.body;
    Item.findOne({name : itemName}, (Item, err) => {
        if(err) {
            throw err;
        }
        const ownerList = [];
        if(Item) {
            Item.ownerIds.forEach((id)=>{
                User.findById(id, (owner, err) => {
                    if(err) {
                        throw err;
                    }
                    if(owner) {
                        ownerList.push(owner);
                    }
                });
            });
        }

        req.user["ownerList"] = ownerList;
        req.user["searchedItem"] = itemName;
        res.render('customer/dashboard', {user : req.user});
    });
});


router.get('/register', (req, res) => {
    res.render('customer/register');
});

router.post('/register', (req, res) => {
    // console.log(req.body);
    const role = "customer";
    const { name,
        email,
        password,
        password2,
        latitude,
        longitude } = req.body;

    const errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all the mandatory fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be of length atleast 6 characters' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('customer/register', {
            errors,
            name,
            email,
            password,
            password2,
            latitude,
            longitude
        });
    } else {

        User.findOne({ email: email })
            .then((customer) => {
                if (customer && customer.role == "customer") {
                    errors.push({ msg: "email already exists" });
                    res.render('customer/register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        latitude,
                        longitude
                    });
                } else {
                    const newCustomer = User({
                        role,
                        name,
                        email,
                        password,
                        latitude,
                        longitude
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            throw err;
                        }
                        bcrypt.hash(newCustomer.password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            }
                            newCustomer.password = hash;
                            newCustomer.save()
                                .then(customer => {
                                    req.flash('success_msg', 'You are successfully registered and now you can log in');
                                    res.redirect('/customer/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        });
                    });
                }
            })
            .catch((err) => {
                throw err;
            });
    }

});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/customer/dashboard',
        failureRedirect: '/customer/login',
        failureFlash: true
    })(req, res, next);
});


router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are successfully logged out');
    res.redirect('/customer/login');
});

module.exports = router;
