var express = require('express')
var app = express()
var imgModel = require('./model');
var mongoose = require('mongoose')
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var dotenv = require('dotenv')
dotenv.config();

mongoose.connect(process.env.CONNECT_TO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected to db')
    });

app.use(express.json())
app.use(express.urlencoded({ extended:false }))

app.set('view engine', 'ejs')
var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({storage: storage});

//fetch the images from the database
app.get('/', (req, res) =>{
    imgModel.find({}, (err, items) =>{
        if(err) {
            console.log(err);
            res.status(500).send('An error occcured', err)
        }
        else{
            res.render('imagesPage', {items: items});
        }
    })
})

//post images to the database
app.post('/', upload.single('image'), (req, res, next) =>{
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) =>{
        if(err){
            console.log(err)
        }else{
            //item.save()
            res.redirect('/')
        }
    })
})

app.listen(process.env.PORT, ()=>{
    console.log("Server working fine")
})