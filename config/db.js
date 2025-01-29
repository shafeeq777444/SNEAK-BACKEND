const mongoose = require("mongoose");
const { db } = require("./config");

connectDB = () =>{
    // this can handle also async await method
    mongoose.connect(db.url,{
        useNewUrlParser: true,
        useUnifiedTopology: true})
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = connectDB;
