//This file is created to record different approach of uploading images
//It is not tested though
const express = require('express')
const { Router } = require('express');
const multer = require('multer');
const mongoose = require('mongoose')

const app = express()

//allows you to adjust how files can be stored
const storage = multer.diskStorage({
   destination: function(req, file, cb){
       cb(null, './uploads/')
   },
   filename: function(req, file, cb){
       cb(null, new Date().toISOString() + file.originalname)//can also use filename here
   }
})

//to reject an incoming file
const fileFilter = (req, res, cb)=> {
    //access file information to filter out certain files you don't want
    if(file.mimeType === 'image/jpeg' || file.mimeType === 'image/png'){
        //accept the file
        cb(null, true)
    }else{
         //reject a file without error message
        cb(null, false)
        //reject the file with error message
        cb(new Error('File not acceptable'), false)
    }
   
}

//the uploads/ folder will be created automatically
const upload = multer({storage: storage});

//to set file size, modify the upload as follows
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //1mb * 5 = 5mb
    },
    fileFilter: fileFilter  //pass in the filter function to accept or reject file
})

Router.post('/', upload.single('productImage'), (req, res, next)=>{
    //console.log(req.file)
    const product = new product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path //holds the url to the image
    })
    //this functon is not complete, just to illustrate sth
    next()
})

//how do we get the file in the database
//product model should look like this
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productImage: {type: String, required: true}
});
module.exports = mongoose.model('Product', productSchema)

//now to see our image in the browser, we make the uploads folder publicly available.
//this is done in our entry file e.g app.js
app.use('/uploads',express.static('uploads'))