const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');

let temperature = null;

fs.readFile('./temp1.sensor',  'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
  temperature = Number(data);
});

fs.watch('./temp1.sensor', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
  temperature = fs.readFileSync('./temp1.sensor',  'utf8');
  temperature = Number(temperature);
});

app.get('/', (req, res) => {
  res.send({ temp: temperature})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})