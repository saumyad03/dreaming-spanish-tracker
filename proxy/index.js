const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
    const method = req.method;
    const { authorization } = req.headers;
    const body = req.body;
    try {
        const response = await fetch('https://www.dreamingspanish.com/.netlify/functions/externalTime', {
            method,
            headers: {
                'Content-Type': 'application/json',
                authorization
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
