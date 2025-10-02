import mongoose, { Schema } from "mongoose";
const NoticeSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true,
   },

    imgUrl: { type: String,
        required: true,    
     },
    public_id: String ,
    originalName: String,
},{ timestamps: true });
const Notice = mongoose.model("Notice", NoticeSchema);
export default Notice;
