import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            retryWrites: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.log("error occured", error); 
        console.log("💡 Tip: Make sure your IP is whitelisted in MongoDB Atlas Network Access");
    }
}
export default connectDB;