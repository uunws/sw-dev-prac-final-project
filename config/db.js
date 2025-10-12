const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`); 
    // see that connect with who
    // `` variable in varible in string?
}

module.exports = connectDB; // export connectDB for server.js can use