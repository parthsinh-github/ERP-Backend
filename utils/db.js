import mongoose from 'mongoose'

mongoose.set('strictQuery',false);

export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDb Connected Succesfully');
        
    } catch (error) {
        console.log(error);
        
    }
}