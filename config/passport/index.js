// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var bcrypt = require('bcrypt');

// expose this function to our app using module.exports
module.exports = function(passport, dbAPI) {
  passport.serializeUser(function(user, done) {
    //console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    dbAPI.getUserById(id).then(function(user) {
      done(null, user[0]);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      process.nextTick(function() {
        dbAPI.getUserByMail(email).then(function(data) {
          if(data.length === 0) {
            bcrypt.genSalt(10, function(err, salt) {
              if(err){
                console.log("ERROR SALT"+err);
              } else {
                bcrypt.hash(password, salt, function(err, pswHash) {
                  if(err){
                    console.log("ERROR HASH"+err);
                  } else {
                    var username = req.body.username;
                    dbAPI.addUser(email, username, pswHash).then(function(users){
                      return dbAPI.getUserByMail(email);
                    }).then(function(newUser){
                      console.log(newUser);
                      return done(null, newUser[0]);
                    });
                  }
                });
              }
            })
          } else {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          }
        })
      })
    }
  ));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      dbAPI.getUserByMail(email).then(function(data) {
        if(data.length === 0) {
         return done(null, false, req.flash('loginMessage', 'No user found.'));
        } else {
          var user = data[0];
          //console.log(user.password);
          //console.log(password);
          bcrypt.compare(password, user.password,  function(err, valid) {
            //console.log(valid);
            if(valid === true){
              return done(null, user);
            } else {
              //console.log("WRONG pwd");
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
          });
      //return done(null, user);
        }
      })
    }
  ));
  
};