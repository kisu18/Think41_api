const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const locr=require('./routes/processr')

const app=express();
app.use(express.json());
app.use(cors());
app.use('/lock',locr);



const uri='mongodb://localhost:27017/'
mongoose.connect(uri).then(console.log('mongo Db connected')).catch(err=>console.log(error));



const PORT=5000;
app.listen(PORT,()=>console.log(`Connected to ${PORT}`));