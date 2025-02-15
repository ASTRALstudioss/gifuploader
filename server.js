const multer = require('multer');
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs');

function routeHandler(req, res) {
  const imageFiles = fs.readdirSync('public/uploads/');
  res.json(imageFiles);
}

app.get('/uploads', routeHandler);

// Serve static files from the 'public' directory
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Change the destination to 'public/uploads/'
  },
  filename: function (req, file, cb) {
    const counter = require('./counter.js');
    const filename = counter.getNextFilename() + path.extname(file.originalname);
    cb(null, filename);
  }
});

app.use(express.static('public'));

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb('Error: Only PNG and GIF files are allowed!', false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');
const sharp = require('sharp');

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err); 
    } else {
      const uploadedFile = req.file;
      const filename = uploadedFile.filename;
      const filePath = path.join('/uploads/', filename);
      res.send(`File uploaded successfully! <br> File path: ${filePath}`);
    }
  });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); 

app.get('/files', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'uploads.html'));
}); 

app.set('view engine', 'ejs');

app.get('/api/files', (req, res) => {
  const imageFiles = fs.readdirSync('/uploads');
  res.json(imageFiles);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});