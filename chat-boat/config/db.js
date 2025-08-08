import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URI || "mongodb+srv://Namami-Innovations:Namami-Innovations@whattameal-cluster.3pqq7.mongodb.net/Whattameal?retryWrites=true&w=majority&appName=Whattameal-Cluster"

const connectDB = async () => {
    try {
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
