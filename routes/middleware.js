const Listing =require("../models/listing")
const Review =require("../models/review")

 module.exports.isLoggedIn=(req,res,next)=>{

 if(!req.isAuthenticated()){
    //redirecurl save
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you need to login or signup") 
    return res.redirect('/user/login') 
  }
  next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }  
  next();
}



module.exports.isOwner=async(req,res,next)=>{
    
let {id}=req.params;
let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
     
       req.flash("error","you are not authorized to edit these")
      return res.redirect(`/listings/${id}`) 
   }
   next()
}



module.exports.isReviewAuthor=async(req,res,next)=>{
    
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
        if(!review.author._id.equals(res.locals.currUser._id)){
         
           req.flash("error","you are not authorized to change these")
          return res.redirect(`/listings/${id}`) 
       }
       next()
    }