// importing required middleware, files and modules

require('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');


// authenticating the user using passport-jwt startegy

const opts ={
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.SECRETKEY,
}

passport.use(new JwtStrategy(opts,function(jwt_payload,done){

        
    User.findOne({id: jwt_payload.sub}).then((user)=>{
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    }).catch((err)=>{
        return done(err, false);
        

    })
}));


module.exports = passport;