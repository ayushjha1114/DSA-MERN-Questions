// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const filePath = path.join(process.cwd(), 'large.csv');

const PORT = 3036;

app.get('/health-check', (req, res) => {
    res.send(`server is healthy at ${PORT}`);
})

// This generates ~100MB CSV file with dummy data
// yes "id,name,email,location\n1,John Doe,john@example.com,Earth" | head -n 1300000 > large.csv

// autocannon -c 25 -d 10 -p 10 http://localhost:3032/csv

// -c 25	25 concurrent clients
// -d 10	Run for 10 seconds
// -p 10	Pipeline 10 requests per client

app.get('/csv', (req, res) => {
  const stream = fs.createReadStream(filePath);

  stream.on('open', () => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="large.csv"');
    stream.pipe(res);
  });

  stream.on('error', (err) => {
    console.error('Stream error:', err.message);
    res.status(500).send('Error streaming file');
  });

  res.on('close', () => {
    stream.destroy(); // clean up if client disconnects
  });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});


// To run this server, use the command:
//docker build -t nodejs-examples .

//docker run -p 3034:3034 nodejs-examples

// Build and start the container
// docker-compose up --build

// go inside the docker image
// docker images
// docker run -it --rm stream-csv /bin/bash
