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

const sharp = require('sharp');

const upload = multer({ dest: 'public/uploads/' });
const crypto = require('crypto');



app.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  const randomFilename = Math.floor(Math.random() * 1999999999999999).toString()
  const extension = path.extname(file.originalname);
  const filename = `${randomFilename}${extension}`;

  while (true) {
    const filePath = path.join(__dirname, 'public', 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      fs.renameSync(file.path, filePath);
      res.send(`Done! Filepath: /uploads/${filename}`);
            break;
    } else {
      const extension = path.extname(originalFilename);
      const basename = path.basename(originalFilename, extension);
      filename = `${basename} (${counter})${extension}`;
      counter++;
    }
  }
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