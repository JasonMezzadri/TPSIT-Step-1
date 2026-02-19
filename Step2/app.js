const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurazione upload immagini
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// 🔹 FORM
app.get('/post', (req, res) => {
    res.render('form');
});


// 🔹 SALVATAGGIO POST
app.post('/post', upload.single('image'), (req, res) => {

    const newPost = {
        id: Date.now(),
        titolo: req.body.titolo,
        descrizione: req.body.descrizione,
        infoExtra: req.body.infoExtra,
        image: req.file ? `/uploads/${req.file.filename}` : null
    };

    const data = fs.existsSync('post.json')
        ? JSON.parse(fs.readFileSync('post.json'))
        : [];

    data.push(newPost);

    fs.writeFileSync('post.json', JSON.stringify(data, null, 2));

    res.redirect('/gallery');
});


// 🔹 GALLERY
app.get('/gallery', (req, res) => {

    const data = fs.existsSync('post.json')
        ? JSON.parse(fs.readFileSync('post.json'))
        : [];

    res.render('gallery', { posts: data });
});


// 🔹 DETTAGLIO POST
app.get('/postGallery/:id', (req, res) => {

    const data = JSON.parse(fs.readFileSync('post.json'));
    const post = data.find(p => p.id == req.params.id);

    res.render('post', { post });
});

app.listen(3000, () =>
    console.log('Server avviato su http://localhost:3000/post')
);
