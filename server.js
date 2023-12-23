const express = require('express');
const app = express();
const path = require('path');
const csvtojson = require('csvtojson');

const csvFilePath = 'anime-dataset-2023.csv'; // Update with your actual CSV file path

app.use(express.static('public'));

app.get('/search', async (req, res) => {
    const query = req.query.query.toLowerCase();

    try {
        const jsonArray = await csvtojson().fromFile(csvFilePath);

        console.log('Parsed JSON array:', jsonArray);

        const results = jsonArray.filter(item => {
            // Ensure item and name property exist before accessing
            return item && item.Name && item.Name.toLowerCase().includes(query);
        });

        res.json(results);
    } catch (error) {
        console.error('Error reading or parsing CSV file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
