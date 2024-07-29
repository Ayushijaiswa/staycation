const Listing=require("../models/listing")
const { or } = require("../schema")
require('dotenv').config();

const maptilerClient=require("@maptiler/client")
maptilerClient.config.apiKey = process.env.MAP_API_KEY;




module.exports.index=async(req,res)=>{
    const listings= await Listing.find({})
     
      res.render("listings/index.ejs",{listings})
  }



  module.exports.renderNewForm=(req,res)=>{
    
      
    res.render("listings/add.ejs")
}
module.exports.showListing=async(req,res)=>{
  let {id}=req.params;
  let data=await Listing.findById(id).populate({path:"reviews",
    populate:{path:"author",

    },
}).populate("owner")

  console.log(data.comment);
  if(!data){
    req.flash("error","listing is not known")
    res.redirect('/listings')
  }
  res.render("listings/show.ejs",{data})
 
}



module.exports.createListing=async(req,res)=>{
  
  
  const result = await maptilerClient.geocoding.forward(req.body.listing.location)
     console.log(result.features[0].geometry);
  let url=req.file.path;
  let filename=req.file.filename;
  console.log("hi");
  console.log(req.file);
  const data =new Listing(req.body.listing)
   data.owner=req.user._id;
   data.image={url,filename};
   data.geometry=result.features[0].geometry;
 let savedData= await data.save()
 console.log(savedData);
   req.flash("success","New Listing createdd")
   res.redirect('/listings')


}

module.exports.deleteListing=async(req,res)=>{
  let {id}=req.params;
   await Listing.findByIdAndDelete(id)
   req.flash("success","Listing is deleted")
   res.redirect('/listings')
}


module.exports.updateListing=async(req,res)=>{
     
  if(!req.body.listing){
      throw new ExpressError(400,"send valid data")
  }
  let {id}=req.params
 
 let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing})
  if( typeof req.file !="undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
 }
  req.flash("success","updated")
  res.redirect(`/listings/${id}`) 
}

module.exports.renderEditForm=async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","listing is not known")
     return  res.redirect('/listings')
  }
 let originalImage= listing.image.url;
   originalImage=originalImage.replace("/upload","/upload/w_250")

  res.render("listings/edit.ejs",{listing,originalImage})
}
