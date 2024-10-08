const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync =require('../utils/wrapAsync.js')
const User=require('../models/user.js');
const passport = require("passport");
const { saveRedirectUrl } = require("./middleware.js");
const userController=require("../controllers/user.js")






router.get("/signup",userController.renderSignupForm)

router.post('/signup',saveRedirectUrl,wrapAsync(userController.signInUser))


router.get("/login",userController.renderLoginForm)


router.post("/login",
    saveRedirectUrl
    ,
    passport.authenticate("local"
,{
    failureRedirect :'/login', failureFlash:true,
}),
wrapAsync(userController.logInUser))




router.get("/logout",userController.logOutUser)














module.exports=router;
