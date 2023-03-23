const mongoose =require('mongoose')

const DB = 'mongodb+srv://azlanajju:passwordforazlan@cluster0.nibktys.mongodb.net/mongodb?retryWrites=true&w=majority';

  const connectMongo= () =>{

 mongoose.connect(DB, {
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
  }).then(()=>{
    console.log("connection successful")
  }).catch((err)=>{
    console.log("error in connection", err);
  });
}
  module.exports = connectMongo;