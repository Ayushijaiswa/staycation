const mongoose=require("mongoose")
const initData=require("./init")
const Listing=require("../models/listing")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(res=>console.log("connected to mongo")).catch(err=>console.log(err))
async function main(){
    await mongoose.connect(MONGO_URL)
}
port=3000;
const initDb=async()=>{
    await Listing.deleteMany({});
  initData.data=  initData.data.map((obj)=>({
        ...obj,owner:"66a6057580621994316aaafe"
    }))
    await Listing.insertMany(initData.data)
}
initDb();
