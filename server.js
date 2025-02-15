const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const counter = require('./counter.js');
    const filename = counter.getNextFilename() + path.extname(file.originalname);
    cb(null, filename);
  }
});

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

app.get('/uploads', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'uploads.html'));
}); 

app.get('/api/files', (req, res) => {
  const files = fs.readdirSync('uploads/');
  res.json(files);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});