const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('file'), (req, res, next) => {
  const file = req.file;
  const { blog_title, blog_author, blog_date, blog_desc } = req.body;

  if (!file || !blog_title || !blog_author || !blog_date || !blog_desc) {
    const error = new Error('Please provide all required fields');
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send('Blog uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

