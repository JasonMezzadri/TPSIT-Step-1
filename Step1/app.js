const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Rotta per visualizzare il form
app.get('/post', (req, res) => {
    res.send(`
        <form method="POST" action="/post">
            <input type="text" name="content" placeholder="Scrivi qualcosa" required>
            <button type="submit">Invia</button>
        </form>
    `);
});

// Rotta per ricevere i dati e salvare su post.json
app.post('/post', (req, res) => {
    const newPost = { id: Date.now(), ...req.body };

    // Leggi il file esistente (o crea array vuoto)
    const data = fs.existsSync('post.json') ? JSON.parse(fs.readFileSync('post.json')) : [];
    
    data.push(newPost);

    // Scrivi su file
    fs.writeFileSync('post.json', JSON.stringify(data, null, 2));
    
    res.send('Dato memorizzato in post.json!');
});

app.listen(3000, () => console.log('Server in esecuzione su http://localhost:3000/post'));