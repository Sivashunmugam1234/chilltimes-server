const mongoose=require("mongoose");

const BlogScheme=new mongoose.Schema({
      title: {
    type: String,
    required: true,
  },
    description: {
    type: String,
    required: true,
  },
    category: {
    type: String,
    required: true,
  },
      likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  }],
  authorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  public:{
    type :Boolean,
    default:false,

  },
  isDeleted:{
    type:Boolean,
    default:false,
  }
},{ timestamps: true })

const BlogModels=mongoose.model("post",BlogScheme);
module.exports=BlogModels;