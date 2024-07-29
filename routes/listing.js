const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync =require('../utils/wrapAsync.js')
const {listingSchema,reviewSchema} =require('../schema.js')
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js")
const mongoose =require("mongoose")
const joi=require("joi")
const flash=require('connect-flash')




const {isLoggedIn, isOwner}=require('../routes/middleware.js')
const listingController=require("../controllers/listings.js")
const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    console.log(error)
    if(error){
        throw new ExpressError(400,error)
    } else next();

}


router.route("/")
.get(wrapAsync( listingController.index))
.post( 
    isLoggedIn,
     upload.single('listing[image]'),
 wrapAsync(listingController.createListing)
//.post(upload.single("listing[image]"),(req,res)=>{
   // res.send(req.file);

)


router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm))
router.get("/:id",wrapAsync(listingController.showListing))
 router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))
router.put("/:id",isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing))

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))


module.exports=router;