const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors())

const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './images')
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + '--'+ file.originalname)
    }
})
const upload = multer({storage: fileStorageEngine})

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

//post single file
app.post('/single', upload.single('image'), (req, res) =>{
    console.log(req.file)
    res.send("Single file upload successful")
})

//post multiple files
app.post('/multiple',upload.array('images', 3), (req, res)=>{
    console.log(req.files)
    res.send("Multiple files uploaded successfully")
})

app.listen(3000, () =>{
    console.log('Server started on port 3000')
})