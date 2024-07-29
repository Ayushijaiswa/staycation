const User=require("../models/user")
const Listing=require("../models/listing")
const Review=require("../models/review")


module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}


module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}


module.exports.logOutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err)
        }
        req.flash("success","Logout successfully")
        res.redirect("/listings")
    })
}



module.exports.logInUser=async(req,res)=>{
      try{
    req.flash("success","welcome to wanderlust")
    let redirectUrl=res.locals.redirectUrl||"/listings"
    res.redirect(redirectUrl)
      }
      catch(e){
        console.log(e);
      }
    
    
    
    }

module.exports.signInUser=async(req,res)=>{

    try{
     let {email,username,password}=req.body;
    const newUser=  new User({email,username});
     const registeredUser=await User.register(newUser,password)
     console.log(registeredUser)
     req.login(registeredUser,(err)=>{
       if(err) {return next(err)}
       req.flash("success","Welcome")
       let redirectUrl=res.locals.redirectUrl ||"/listings"
       res.redirect(redirectUrl)
      
       
     })
    
    }
    catch(err){
       req.flash("error",err.message)
       res.redirect("/signup")
   }
   
   }
    



