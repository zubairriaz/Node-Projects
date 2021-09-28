const mongoose = require("mongoose");


exports.connectDB = async () => {
  console.log(`Starting conn at ${process.env.Consumer_Key}`)

  const conn =  await mongoose.connect(process.env.MOONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log(`MongoDB connected: ${conn.connection.host} , ${process.env.MOONGO_URI}`)
};


