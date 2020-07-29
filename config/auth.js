const { User } = require("../models/User");

const ROLE = {
    CUSTOMER : "customer",
    SHOPOWNER : "shopOwner"
}

module.exports = {
    ROLE,
    setUser: function (req, res, next) {
        const userId = req.body.userId;
        if (userId) {
            // console.log(userId);
            req.user = User.findOne({ _id: userId })
                .then(user => {
                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        res.status(403);
                        return res.send('You are not allowed to access this');
                    }
                }).catch(err => {
                    throw err;
                });
        }
    },
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        console.log(req.role);
        res.redirect('/' + req.role + '/login');
    },
    setRole : function(role) {
        return (req, res, next) => {
            if(!req.user) {
                req.role = role;
            }
            next();
        }
    }
}