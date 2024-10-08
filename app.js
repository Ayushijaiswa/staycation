
require('dotenv').config()







const express=require("express")
const app=express()
const session=require("express-session")
const MongoStore=require("connect-mongo")
const ExpressError=require("./utils/ExpressError.js")
const methodOverride=require("method-override")
const mongoose =require("mongoose")
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require('./models/user.js')
const userRouter=require("./routes/user.js")
const Listing=require("./models/listing.js")


const path=require("path")

const listingRouter=require('./routes/listing.js')
const reviewsRouter=require("./routes/reviews.js")






app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
const ejsMate=require("ejs-mate")
const { getMaxListeners } = require("events")
const { error } = require('console')

app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

app.set("views",path.join(__dirname,"views"))




//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

const dburl=process.env.ATLAS_URL
main().then(res=>console.log("mongodb connected")).catch(err=>console.log(err))
async function main(){
    await mongoose.connect(dburl)
}
port=3000;



const store=MongoStore.create({
 mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
})









store.on("error",()=>{
    console.log("error");
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }


}



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
  
     next();
})

app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student",
    })
 const registeredUser= await  User.register(fakeUser,"helloworld")
 res.send(registeredUser)
})
   



app.get('/',async(req,res)=>{
    const listings= await Listing.find({})
     
    res.render("listings/index.ejs",{listings});
})


app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/user",userRouter);

















app.all("*",(req,res,next)=>{
    next(new ExpressError (404,"page not found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.render("error.ejs",{message})
   
   
})



app.listen(port,()=>{
    console.log("server is listening ")
})