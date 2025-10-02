import mongoose, { Schema } from "mongoose";
const PosterSchema = new mongoose.Schema({

    imgUrl: { type: String,
        required: true,    
     },
    discription: {
      type: String, 
    },
    public_id: String 
},{ timestamps: true });
const EventPoster = mongoose.model("EventPoster" ,PosterSchema);
export default EventPoster;
