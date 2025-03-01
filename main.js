require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT

//db connection

mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',(err)=>{
    console.log(err);
})
db.once('open',()=>{
    console.log('connected to database!');
    
})

//middelwares
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
}))

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})
//for image view;
app.use(express.static('uploads'));

app.set('view engine', 'ejs');

//route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, ()=>(

    console.log(`server started at http://Localhost: ${PORT}`)
));