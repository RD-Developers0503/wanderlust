const mongoose = require("mongoose")
const Listing = require("../models/listing.js")
const initData = require("./data.js")
const MongoUrl = 'mongodb://127.0.0.1:27017/wanderlust'

main()
    .then(()=>{
        console.log("db is successfully connnected")
    })
    .catch((err)=>{
        console.log(err)
    })

async function main(){
    await mongoose.connect(MongoUrl);
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj => ({...obj, owner: "65d411d92b615431bca66e2a"})));
    await Listing.insertMany(initData.data)
    console.log("data is inserted successfully")
}

initDb();
